(function ($) {
    $cache = {};

    var methods = {
        init: function () {
            return this.each(function () {
                var elem = $(this);

                elem.addClass("prettified");

                if (elem.is("input[type='text'],input[type='password']")) {
                    prettifyTextInput(elem);
                } else if (elem.is("input[type='checkbox'],input[type='radio']")) {
                    prettifyInputSelector(elem);
                } else if (elem.is("input[type='submit'], input[type='button']")) {
                    prettifyButton(elem);
                } else if (elem.is("select")) {
                    prettifySelect(elem);
                } else {
                    $.error("The type: " + elem.get(0).tagName + " cannot be prettified.");
                }
            });
        },
        reset: function () {
            return this.each(function () {
                var elem = $(this);

                if (elem.is("input[type='text'],input[type='password']")) {
                    elem.val("");
                } else if (elem.is("input[type='checkbox'],input[type='radio']")) {
                    elem.parent().removeClass("checked");
                } else if (elem.is("input[type='submit'], input[type='button']")) {
                    elem.parent().removeClass("focus");
                } else if (elem.is("select")) {
                    elem.get(0).selectedIndex = 0;
                    elem.parent().children(".selected").text(elem.children(":selected").text());
                } else {
                    $.error("The type: " + elem.get(0).tagName + " cannot be reset.");
                }
            });
        }
    };
    $.fn.prettify = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method: " + method + "does not exist");
        }
    };
    //private functions
    function prettifyTextInput(elem) {
        //disables the yellow background for google chrome if the remember password element is activated.
        elem.attr("autocomplete", "off");
        elem.wrap("<span class=\"textfield " + elem.attr("class") + "\"/>");

        elem.bind({
            focus: function () {
                elem.parent().addClass("focus");
            },
            blur: function () {
                elem.parent().removeClass("focus");
            }
        });
    };
    function prettifyInputSelector(elem) {
        var checked = elem.get(0).checked ? "checked" : "";

        elem.css("opacity", 0);
        elem.wrap("<span class=\"" + elem.attr("type") + " " + elem.attr("class") + " " + checked + "\"/>");

        var span = $("span." + elem.attr("type") + "");

        elem.bind({
            focus: function () {
                elem.parent().addClass("focus");
            },
            blur: function () {
                elem.parent().removeClass("focus");
            },
            change: function () {
                if (this.type === "radio") {
                    $("input[name='" + elem.attr("name") + "']").parent().removeClass("checked");
                }
                if (this.checked) {
                    elem.parent().addClass("checked");
                } else {
                    elem.parent().removeClass("checked");
                }
            }
        });
    };
    function prettifyButton(elem) {
        if (elem.attr("type") === "submit" && elem.attr("class") === "nosubmit")
            elem.wrap("<span class=\"button\"/>");
        else
            elem.wrap("<span class=\"button submit\"/>");

        elem.bind({
            focus: function () {
                elem.parent().addClass("focus");
            },
            blur: function () {
                elem.parent().removeClass("focus");
            },
            mousedown: function () {
                elem.parent().addClass("active");
            },
            mouseup: function () {
                elem.parent().removeClass("active");
            }
        });
    };
    function prettifySelect(elem) {
        var label = elem.children(":selected").text();
        var container = $("<div class=\"combobox " + elem.attr("class") + "\"><span class=\"selected\">" + label + "</span></div>");
        container.css("width", 230);

        elem.replaceWith(container).appendTo(container);
        elem.css("opacity", 0);

        elem.bind({
            focus: function () {
                elem.parent().addClass("focus");
            },
            blur: function () {
                elem.parent().removeClass("focus");
            },
            change: function () {
                elem.parent().children(".selected").text(elem.children(":selected").text());
            },
            options_added: function () {
                $(this).parent().children(".selected").text($(this).children(":selected").text());
            }
        });
    };
})(jQuery);
