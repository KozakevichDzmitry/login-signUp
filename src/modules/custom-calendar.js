import {CustomSelect} from "@/modules/custom-selector";

export class CustomCalendar {
    constructor(options) {
        class CustomCalendarField extends CustomSelect {
            constructor(customSelectID, selectID, type) {
                super(customSelectID, selectID);
                this.type = type
                this.createDropDownItem()
            }

            sendValueInSelect = (elem) => { //Send value in object CustomCalendarField
                elem ? this.value = elem.dataset.value : this.value = '';
                setValue(this.type)
            }

            createDropDownItem(day = 31) {
                if (this.type === 'day') {

                    //  Crate and update HTML list in drop-down Day
                    this.dropDownMenu.innerHTML = ''
                    for (let i = 1; i <= day; i++) {
                        let element = `<li data-value=${i} class="drop-down__item select-nationality">${i}</li>`
                        this.dropDownMenu.innerHTML += element;
                    }

                    if (this.value > day) {   // Resetting data if a month with fewer days is selected
                        this.sendValueInSelect()
                        this.btnDown.innerHTML = `<span>Day<span>`;
                    }
                } else if (this.type === 'month') {

                    //  Crate and add HTML list in drop-down Month
                    let elementList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                        .map((item, index) => {
                            return `<li data-value=${index} class="drop-down__item select-nationality">${item}</li>`
                        })
                    elementList.forEach(item => this.dropDownMenu.innerHTML += item)

                } else if (this.type === 'year') {

                    //  Crate and add HTML list in drop-down Year
                    for (let i = new Date().getFullYear(); i >= 1900; i--) {
                        let element = `<li data-value=${i} class="drop-down__item select-nationality">${i}</li>`
                        this.dropDownMenu.innerHTML += element;
                    }
                }
            }
        }

        this.calendar = document.querySelector(`#${options.selectID}`)

        let self = this
        const customFieldDay = new CustomCalendarField(options.dayId, options.selectID, 'day')
        const customFieldMonth = new CustomCalendarField(options.monthID, options.selectID, 'month')
        const customFieldYear = new CustomCalendarField(options.year, options.selectID, 'year')


        function setValue(type) { // Set value in object Class
            if (type === 'day') {
                self.day = customFieldDay.value
            } else if (type === 'month') {
                self.month = customFieldMonth.value
                let lastDays = self.getLastDayOfMonth(self.year, self.month)
                if (lastDays) customFieldDay.createDropDownItem(lastDays)
            } else if (type === 'year') {
                self.year = customFieldYear.value
                let lastDays = self.getLastDayOfMonth(self.year, self.month)
                if (lastDays) customFieldDay.createDropDownItem(lastDays)
            }
            if (self.year && self.month && self.day) self.sendValueInCalendar()
        }
    }

    getLastDayOfMonth(year, month) {
        let lastDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // List number of days in a month in order (Index=Month)
        month = parseInt(month)

        if (year && month && month === 1) { //number of days in February
            let date = new Date(year, month + 1, 0);
            return date.getDate();
        } else if (month) { //number of days in other month
            return lastDays[month]
        } else return null
    }

    sendValueInCalendar() { //Send value in original SELECT
        let date = new Date(this.year, this.month, this.day)
        let addZero = num => (num >= 0 && num <= 9) ? '0' + num : num;
        date = `${addZero(date.getFullYear())}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`
        this.calendar.value = date;
    }

}
