import './style/style.scss';


window.onload = ()=> {
    const menu = document.querySelectorAll('.drop-down')
    const btnDown = document.querySelector('#dropDown');
    const dropDownMenu = document.querySelector('.drop-down__menu');
    const nationality = document.querySelector('#nationality');


    btnDown.addEventListener('click', changeStateMenu)
    dropDownMenu.addEventListener('click', chooseElement)


    function changeStateMenu(e){  // Opens and closes the menu on click
        const parentElement = e.currentTarget.parentElement;

        if(!parentElement) return
        if(parentElement.classList.contains('drop-down--active')) {
            closeMenu()
            dropDownMenu.removeEventListener('click', chooseElement)
            window.removeEventListener('click', closeMenu)
        } else{
            e.stopPropagation()
            parentElement.classList.add('drop-down--active')
            dropDownMenu.addEventListener('click', chooseElement)
            window.addEventListener('click', closeMenu)
        }

    }

    function chooseElement(e){ // Choose a custom element and send the value in custom SELECT (exchange btn value)
        const elem = e.target;
        if(elem.classList.contains('drop-down__item')) {
            btnDown.textContent = elem.textContent;
            sendValueInSelect(elem)
        }
    }

    function closeMenu(){ // Close all menu
        if(menu) menu.forEach(item=> item.classList.remove('drop-down--active'))
    }

    function sendValueInSelect(elem){  //Send the value in origin SELECT
        const value = elem.dataset.value;
        if(elem.classList.contains('select-nationality')){
            nationality.value = value; console.log(nationality.value)
        }

    }

}


