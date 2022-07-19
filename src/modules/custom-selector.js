export class CustomSelect {
    constructor(customSelectID, selectID) {
        this.customSelect = document.querySelector(`#${customSelectID}`)
        this.btnDown = this.customSelect.querySelector('.drop-down__button');
        this.dropDownMenu = this.customSelect.querySelector('.drop-down__menu');
        this.select = document.querySelector(`#${selectID}`);

        this.btnDown.addEventListener('click', () => this.changeStateMenu())
        this.dropDownMenu.addEventListener('click', ()=> this.chooseElement())
        window.addEventListener('click', (e)=> this.closeMenu())
    }

    closeMenu() { // Close the menu
        if (this.customSelect) this.customSelect.classList.remove('drop-down--active')
    }

    openMenu() { // Open the menu
        if (this.customSelect) this.customSelect.classList.add('drop-down--active')
    }

    changeStateMenu(e) {  // Opens and closes the menu on click
        e = e || window.event;
        e.stopPropagation()
        const parentElement = e.currentTarget.parentElement;

        if (parentElement.classList.contains('drop-down--active')) {
            this.closeMenu()
        } else {
            this.openMenu()
        }

    }

    chooseElement(e) { // Choose a custom element and send the value in custom SELECT (exchange btn value)
        e = e || window.event;
        const elem = e.target;
        if (elem.classList.contains('drop-down__item')) {
            this.btnDown.textContent = elem.textContent;
            this.btnDown.classList.remove('invalid')
            this.sendValueInSelect(elem)
        }
    }

    sendValueInSelect (elem) {  //Send the value in origin SELECT
        const value = elem.dataset.value;
        if (elem.classList.contains('select-nationality')) {
            this.select.value = value;
            this.select.classList.remove('invalid')
        }
    }

}