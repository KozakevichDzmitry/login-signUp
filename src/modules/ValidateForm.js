export class ValidateForm {
    constructor(formID) {
        this.form = document.querySelector(`#${formID}`);
        this.elements= this.form.elements;
        [...this.elements].forEach(elem => elem.addEventListener('change', (e) => this.checkFieldAfterChange(e)))
        this.submit = this.form.querySelector(`*[type="submit"]`);
        this.submit.addEventListener('click', (e) => {
            e.preventDefault()
            this.checkFieldBeforeSending()
        })
    }

    checkFieldAfterChange(e) {
        e = e || window.event;
        let elem = e.currentTarget
        let inputType = elem.dataset.required
        if (inputType === 'name') this.initValidation(this.checkText, elem);
        else if (inputType === 'email') this.initValidation(this.checkEmail, elem);
        else if (inputType === 'pass') this.initValidation(this.checkPass, elem);
        else if (inputType === 'pass-confirm') this.initValidation(this.comparePass, elem);
        else if (inputType === 'pass-confirm') this.initValidation(this.comparePass, elem);
        else if (inputType === 'radio-gender') this.initValidation(this.checkRadioGroup, elem);
    }

    checkFieldBeforeSending() {
        [].forEach.call(this.form.elements, (elem => {
            let inputType = elem.type
            if (inputType === 'text') {
                this.initValidation(this.checkText, elem);
                return false
            } else if (inputType === 'email') {
                this.initValidation(this.checkEmail, elem);
                return false
            } else if (inputType === 'radio') {
                this.initValidation(this.checkRadioGroup, elem);
                return false
            } else if (inputType === 'password') {
                this.initValidation(this.checkPass, elem);
                return false
            } else if (inputType === 'password' && elem.name === 'confirmPassword') {
                this.initValidation(this.comparePass, elem);
                return false
            } else if (inputType === 'date') {
                this.initValidation(this.checkDate, elem);
                return false
            } else if (inputType === 'select-one') {
                this.initValidation(this.checkSelect, elem);
                return false
            }
            return true
        }))
    }

    checkEmail(elem) {
        let value = elem.value.trim()
        let arr = value.split('@');
        let mailbox = arr[0];
        let hostname = arr[1] || "";
        let replaceMailbox = mailbox.replace(/[0-9a-z-_.]/gi, "");
        let replaceHostname = hostname.replace(/[0-9a-z-.]/g, "");

        if (mailbox.length > 31 || mailbox.length < 5) return false             //в mailbox должно быть от 5 до 31 символа
        else if (replaceMailbox.length > 0) return false
        else if (replaceHostname.length > 0) return false
        else if (hostname.length > 12 || hostname.length < 5) return false     //в hostname должно быть от 5 до 12 символов
        else if (value.search(/-{2,}/) > 0) return false               //проверка есть ли более одного дефиса подряд
        else if (value.search(/\.{2,}/) > 0) return false              //проверка есть ли более одного дефиса подряд
        else if (value.search(/\.([a-z]{2,4})$/) < 0) return false     // проверка заканчивается ли строка точкой и от 2 до 4 букв

        return true
    }

    checkText(elem) {
        let value = elem.value.trim()
        let replace = value.replace(/^[A-Za-zа-яёА-ЯЁ\s]{1,}[-]{0,1}[A-Za-zа-яёА-ЯЁ\s]{0,}$/gi, "");

        if (replace.length > 0 || value.length === 0 || value.length > 200) return false

        return true
    }

    checkRadioGroup(elem) {
        let radioGroup = document.querySelectorAll(`*[name=${elem.name}]`);
        return [].some.call(radioGroup, item => item.checked);
    }

    checkPass(elem) {
        return elem.value.length >= 8;
    }

    comparePass(elem) {
        let passConfirmValue = elem.value;
        let passValue = document.querySelector('*[data-required="pass"]').value;
        return passValue === passConfirmValue;
    }

    checkSelect(elem) {
        if(elem.value==='' || elem.value==='none' ||  !elem.value) return false
        return true
    }

    checkDate(elem) {
        const dateNow = new Date();
        if (elem.value) {
            const selectDate = new Date(elem.value);
            return dateNow.getTime() > selectDate.getTime();
        }
        return false
    }

    initValidation(checkFunc, elem) {
        const resultChecking =  checkFunc(elem)
        if(elem.classList.contains('custom-select')){
            const elementID = elem.id;
            const customElements = document.querySelectorAll(`*[data-inputID=${elementID}]`)
            customElements.forEach(elem=> resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem))
        }else if(elem.classList.contains('custom-radio')){
            const radioGroupArr = document.querySelectorAll(`*[name=${elem.name}]`);
            radioGroupArr.forEach(elem=> resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem))
        }
        resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem);
    }

    setValidClass(elem) {
        elem.classList.remove('invalid')
        elem.classList.add('valid')
    }

    setInvalidClass(elem) {
        elem.classList.remove('valid')
        elem.classList.add('invalid')
    }
}