import './style/style.scss';
import {CustomSelect} from "@/modules/custom-selector";
import {CustomCalendar} from "@/modules/custom-calendar";


const customSelect = new CustomSelect('dropDownNationality', 'nationality')


const customCalendar = new CustomCalendar({
    dayId: 'dropDownDay',
    monthID: 'dropDownMonth',
    year: 'dropDownYear',
    selectID: 'date',
})




