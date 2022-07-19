export class ValidateForm {
    constructor(formID) {
        this.form = document.querySelector(`#${formID}`);
        this.elements = this.form.elements;
        [...this.elements].forEach(elem => elem.addEventListener('change', (e) => this.checkFieldAfterChange(e)))
        this.submit = this.form.querySelector(`*[type="submit"]`);
        this.submit.addEventListener('click', (e) => {
            e.preventDefault()
            this.checkFieldBeforeSending() ? this.sendForm() : this.errorForm();
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
        let result = true;
        [].forEach.call(this.form.elements, (elem => {
            let inputType = elem.type
            if (inputType === 'text') {
                if (!this.initValidation(this.checkText, elem)) result = false;
            } else if (inputType === 'email') {
                if (!this.initValidation(this.checkEmail, elem)) result = false;
            } else if (inputType === 'radio') {
                if (!this.initValidation(this.checkRadioGroup, elem)) result = false;
            } else if (inputType === 'password') {
                if (!this.initValidation(this.checkPass, elem)) result = false;
            } else if (inputType === 'password' && elem.name === 'confirmPassword') {
                if (!this.initValidation(this.comparePass, elem)) result = false;
            } else if (inputType === 'date') {
                if (!this.initValidation(this.checkDate, elem)) result = false;
            } else if (inputType === 'select-one') {
                if (!this.initValidation(this.checkSelect, elem)) result = false;
            }
        }))
        return result
    }

    checkEmail(elem) {
        let value = elem.value.trim()
        let arr = value.split('@');
        let mailbox = arr[0];
        let hostname = arr[1] || "";
        let replaceMailbox = mailbox.replace(/[0-9a-z-_.]/gi, "");
        let replaceHostname = hostname.replace(/[0-9a-z-.]/g, "");

        if (mailbox.length > 31 || mailbox.length < 5) return false               //mailbox must be between 5 and 31 characters
        else if (replaceMailbox.length > 0) return false
        else if (replaceHostname.length > 0) return false
        else if (hostname.length > 12 || hostname.length < 5) return false        //hostname must be between 5 and 12 characters
        else if (value.search(/-{2,}/) > 0) return false                  //check if there is more than one hyphen in a row
        else if (value.search(/\.{2,}/) > 0) return false                 //check if there is more than one hyphen in a row
        else if (value.search(/\.([a-z]{2,4})$/) < 0) return false        // checking if a string ends with a dot and between 2 and 4 letters

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
        if (elem.value === '' || elem.value === 'none' || !elem.value) return false
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
        const resultChecking = checkFunc(elem)
        if (elem.classList.contains('mmmm')) {
            const inputID = elem.dataset.inputID
            const originalSelect = document.querySelectorAll(`#${inputID}`);
            const customElements = document.querySelectorAll(`*[data-inputID=${inputID}]`);

           if(resultChecking){
               this.setValidClass(elem);

               if(![...customElements].some(elem => elem.classList.contains('invalid'))) this.setValidClass(originalSelect);
           } else this.setInvalidClass(elem);
        }else if (elem.classList.contains('custom-select')) {
            const elementID = elem.id;
            const customElements = document.querySelectorAll(`*[data-inputID=${elementID}]`);
            [elem, ...customElements].forEach(elem => resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem))
        } else if (elem.classList.contains('custom-radio')) {
            const radioGroupArr = document.querySelectorAll(`*[name=${elem.name}]`);
            radioGroupArr.forEach(elem => resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem))
        }
        resultChecking ? this.setValidClass(elem) : this.setInvalidClass(elem);
        return resultChecking
    }

    setValidClass(elem) {
        elem.classList.remove('invalid')
        elem.classList.add('valid')
    }

    setInvalidClass(elem) {
        elem.classList.remove('valid')
        elem.classList.add('invalid')

    }

    sendForm() {
        const data = this.serializeForm()
        fetch('/email', {
            "method": 'POST',
            "body": data,
            // "headers": {'Content-Type': 'multipart/form-data'},
        }).then(response => {
            if (response.ok) {
                this.showMessage()
                this.form.reset()
            } else {
                return response.json().then(error => {
                    const e = new Error('Error')
                    e.data = error
                    throw e
                })
            }
        })
        // .catch(error => {
        // this.showMessage(`${error.name}: Возникла проблема. Обратитесь в службу поддержки.`)
        // }).finally(() => this.spinnerEffectLoading(false))

    }

    errorForm() { //add animate rocking from side to side for button then form has mistake
        new Promise(resolve => {
            this.submit.classList.add('error');
            setTimeout(() => {
                resolve()
            }, 1500)
        }).then(() => this.submit.classList.remove('error'))
    }


    serializeForm() {
        return new FormData(this.form)
    }

    showMessage() {
        this.form.parentElement.classList.add('hidden')
    }
}