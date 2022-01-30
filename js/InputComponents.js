const InputComponents = (() => {
    setInputEvents();

    function setInputEvents() {
        // Make the checkboxes toggleable
        let checkboxes = document.getElementsByClassName("checkbox");
        for (let i=0; i<checkboxes.length; i++) {
            Events.on("click", checkboxes[i], toggleBox);
        }
    }

    function toggleBox(event) {
        if (event.target.classList.contains("checked"))
            event.target.classList.remove("checked");
        else
            event.target.classList.add("checked");
    }

    function createCheckbox(id, label) {
        let element = document.createElement("div");
        let inner = document.createElement("div");
        let hiddenInput = document.createElement("input");
        let box = document.createElement("div");
        let labelEl = document.createElement("label");

        labelEl.innerHTML = label;
        box.innerHTML = '\
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\
             width="405.272px" height="405.272px" viewBox="0 0 405.272 405.272" style="enable-background:new 0 0 405.272 405.272;"\
             xml:space="preserve">\
        <g>\
            <path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836\
                c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064\
                c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z"/>\
        </g>\
        </svg>';

        element.className = "checkbox-holder";
        inner.className = "checkbox";
        hiddenInput.type = "hidden";
        box.className = "box";
        box.id = id;

        inner.appendChild(labelEl);
        inner.appendChild(hiddenInput);
        inner.appendChild(box);
        element.appendChild(inner);
        
    }

    function updated() {
        setInputEvents();
    }

    return {
        updated,
        createCheckbox
    }
})();
