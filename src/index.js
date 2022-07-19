import './style/style.scss';
import {CustomSelect} from "@/modules/custom-selector";
import {CustomCalendar} from "@/modules/custom-calendar";
import {ValidateForm} from "@/modules/ValidateForm";



const customSelect = new CustomSelect('dropDownNationality', 'nationality')

const customCalendar = new CustomCalendar({
    dayId: 'dropDownDay',
    monthID: 'dropDownMonth',
    year: 'dropDownYear',
    selectID: 'date',
})

const validateForm = new ValidateForm('signUpForm')
