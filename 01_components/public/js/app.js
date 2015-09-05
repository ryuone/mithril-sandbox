var Contact = function(data){
    data = data || {
            "id": "",
            "name": "",
            "email": ""
        };
    this.id = m.prop(data.id);
    this.name = m.prop(data.name);
    this.email = m.prop(data.email)
};
Contact.list = function(data){
    return m.request({
            method: "GET",
            url: "/api/contact",
            data: data,
            type: Contact
        }
    )
};
Contact.save = function(data){
    return m.request({
            method: "POST",
            dataType: "json",
            url: "/api/contact",
            data: data,
            type: Contact
        }
    )
};

var Observable = function(){
    var controllers = [];
    return {
        register: function(controller){
            return function(){
                var ctrl = new controller;
                ctrl.onunload = function(){
                    controllers.splice(controllers.indexOf(ctrl), 1)
                };
                controllers.push({
                    instance: ctrl,
                    controller: controller
                });
                return ctrl
            }
        },
        trigger: function(){
            controllers.map(function(c){
                ctrl = new c.controller;
                for(var i in ctrl) c.instance[i] = ctrl[i]
            })
        }
    }
}.call();

var ContactsWidget = {
    view: function(ctrl){
        return [
            ContactForm,
            ContactList
        ]
    }
};

var ContactForm = {
    controller: function(){
        this.contact = m.prop(new Contact());
        this.save = function(contact){
            Contact.save(contact).then(Observable.trigger)
        }
    },
    view: function(ctrl){
        var contact = ctrl.contact();

        return m("form", [
            m("label", "名前"),
            m("input", {
                oninput: m.withAttr("value", contact.name),
                value: contact.name()
            }),

            m("label", "Eメール"),
            m("input", {
                oninput: m.withAttr("value", contact.email),
                value: contact.email()
            }),

            m("button[type=button]", {onclick: ctrl.save.bind(this, contact)}, "保存")
        ])
    }
};
var ContactList = {
    controller: Observable.register(function(){
        console.log("create ContactList controller");
        this.contacts = Contact.list()
    }),
    view: function(ctrl){
        console.log(ctrl);
        return m("table", [
            ctrl.contacts().map(function(contact){
                return m("tr", [
                    m("td", contact.id()),
                    m("td", contact.name()),
                    m("td", contact.email())
                ])
            })
        ])
    }
};

function init(){
    m.mount(document.body, ContactsWidget);
}

window.onload = init;
