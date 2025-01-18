import Passenger from './Passenger';
import axios from "axios";
import AppModel from "../model/AppModel.js";

export default class Flight {
    #passengers = [];
    #flightDate = '';
    #flightDestination = '';
    #flightPlane = '';
    #flightId = '';

    constructor({
                    id = null,
                    date,
                    destination,
                    plane,
                    // onMoveTask,
                    onDropTaskInTasklist,
                    onEditTask,
                    onDeleteTask,
                    onDeleteFlight,
                    onFlightEditSubmit = {}, onEditFlightPress = {},


                }) {
        this.#flightDate = date;
        this.#flightDestination = destination;
        this.#flightPlane = plane;
        this.#flightId = id || crypto.randomUUID();
        // this.onMoveTask = onMoveTask;
        this.onDropTaskInTasklist = onDropTaskInTasklist;
        this.onEditTask = onEditTask;
        this.onDeleteTask = onDeleteTask;
        this.onDeleteFlight = onDeleteFlight;
        this.onEditFlightPress = onEditFlightPress;
        this.onFlightEditSubmit = onFlightEditSubmit

    }


    stringify() {
        return {
            flightsID: this.#flightId,
            flight_dt: this.#flightDate,
            city: this.#flightDestination,
            plane_id: this.#flightPlane,
        }
    }

    addBooks(books) {
        let i = 0;
        books.forEach(book => {
            i++;
            let b = new Passenger({
                text: book.fullname,
                id: book.id,
                order: i,
                onEditTask: this.onEditTask,
                onDeleteTask: this.onDeleteTask
            });
            this.#passengers.push(b)
            let render = b.render()
            document.querySelector(`[id="${this.#flightId}"] .bookinglist__item`)
                .appendChild(render);
        })
    }

    get flightId() {
        return this.#flightId;
    }

    get flightDestination() {
        return this.#flightDestination;
    }

    get flightDate() {
        return this.#flightDate;
    }

    addTask = ({task}) => this.#passengers.push(task);

    getTaskById = ({taskID}) => this.#passengers.find(task => task.taskID === taskID);

    deleteTask = ({taskID}) => {

        const deleteTaskIndex = this.#passengers.findIndex(task => task.taskID === taskID);

        if (deleteTaskIndex === -1) return;

        const [deletedTask] = this.#passengers.splice(deleteTaskIndex, 1);

        return deletedTask;
    };

    reorderTasks = () => {
        console.log(document.querySelector(`[id="${this.#flightId}"] .bookinglist__item`));
        const orderedTasksIDs = Array.from(
            document.querySelector(`[id="${this.#flightId}"] .bookinglist__item`).children,
            elem => elem.getAttribute('id')
        );

        orderedTasksIDs.forEach((taskID, order) => {
            this.#passengers.find(task => task.taskID === taskID).taskOrder = order;
        });

        console.log(this.#passengers);
    };

    onAddNewPassenger = () => {
        const newTaskText = prompt('Введите имя пассажра:', 'Иванов Иван');

        if (!newTaskText) return;

        const newTask = new Passenger({
            text: newTaskText,
            order: this.#passengers.length,
            // onMoveTask: this.onMoveTask,
            onEditTask: this.onEditTask,
            onDeleteTask: this.onDeleteTask,
        });


        let success = AppModel.addBookings({
            bookingID: newTask.taskID,
            fullname: newTaskText,
            flightID: this.#flightId
        })
        success.then(result => {
            if (result.statusCode) {
                console.log(result)
            } else {
                this.#passengers.push(newTask);
                const newTaskElement = newTask.render();
                document.querySelector(`[id="${this.#flightId}"] .bookinglist__item`)
                    .appendChild(newTaskElement);
            }
        }).catch(error => {
            alert('Пассажир с таким именем уде зарегистрирован')
        })
    };

    render() {
        const liElement = document.createElement('li');
        liElement.classList.add(
            'tasklists-list__item',
            'tasklist'
        );
        liElement.setAttribute('id', this.#flightId);
        liElement.addEventListener(
            'dragstart',
            () => localStorage.setItem('srcTasklistID', this.#flightId)
        );

        liElement.addEventListener('drop', this.onDropTaskInTasklist);
        let curdate = new Date(this.#flightDate)
        const options1 = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        const options2 = {
            hour: 'numeric',
            minute: 'numeric'
        };
        const dateTimeFormat1 = new Intl.DateTimeFormat('ru', options1);
        const dateTimeFormat2 = new Intl.DateTimeFormat('ru', options2);
        var day = ("0" + curdate.getDate()).slice(-2);
        var month = ("0" + (curdate.getMonth() + 1)).slice(-2);
        var today = curdate.getFullYear() + "-" + (month) + "-" + (day);

        liElement.innerHTML = '<div class="flight-info__wrapper">\n' +
            '<div class="left-wrapper">' +
            '              <div class="flight-info__info-data d-main">\n' +
            '                <h2 class="flight-info__info-data name-ticket white-text" style="font-size: clamp(1.2rem, 2.0vw, 2.0rem)">Рейс</h2>\n' +
            '                <ul class="flight-info__info-data list-data">\n' +
            '                  <li class="list-data__item">\n' +
            '                    <span class="list-data__item value date-val disc-color" style="font-size: clamp(0.6rem, 1.3vw, 1.3rem)">\n' +
            'Дата: ' +
            '                    </span>\n' +
            '                    <span class="list-data__item value date-val white-text"">\n' +
            dateTimeFormat1.format(curdate).toString() + ' ' + dateTimeFormat2.format(curdate).toString() +
            '                    </span>\n' +
            '                  </li>\n' +
            '                  <li class="list-data__item">\n' +
            '                    <span class="list-data__item value date-val disc-color" style="font-size: clamp(0.6rem, 1.3vw, 1.3rem)">\n' +
            'Пункт назначения: ' +
            '                    </span>\n' +
            '                    <span class="list-data__item value dest-val white-text">\n' +
            this.#flightDestination +
            '                    </span>\n' +
            '                  </li>\n' +
            '                  <li class="list-data__item">\n' +
            '                    <span class="list-data__item value date-val disc-color" style="font-size: clamp(0.6rem, 1.3vw, 1.3rem)">\n' +
            'Самолет: ' +
            '                    </span>\n' +
            '                    <span class="list-data__item value white-text">\n' +
            this.#flightPlane +
            '                    </span>\n' +
            '                  </li>\n' +
            '                </ul>\n' +
            '              </div>\n' +
            '              <div class="flight-info__info-data d-form">\n' +
            '<form action="" class="flight_edit_form">\n' +
            '          <div class="info-adder__wrapper">\n' +
            '\n' +
            '            <div class="info-adder__input date-time">\n' +
            '              <span class="name-item white-text">\n' +
            '                Дата вылета\n' +
            '              </span>\n' +
            '              <input\n' +
            '                      type="datetime-local" name="flightDate" value="' + curdate.toJSON().slice(0, -5) + '"\n' +
            '              >\n' +
            '\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="info-adder__input city">\n' +
            '              <span class="name-item white-text">\n' +
            '                Пункт назначения\n' +
            '              </span>\n' +
            '              <input\n' +
            '                      type="text" name="flightDest" value="' + this.#flightDestination + '"\n' +
            '              >\n' +
            '            </div>\n' +
            '<div class="info-adder__input plane">\n' +
            '              <span class="name-item white-text">\n' +
            '                Самолет\n' +
            '              </span>\n' +
            '              <select name="flightPlane" id="first-select-' + this.#flightId + '">\n' +
            '              </select>\n' +
            '            </div>' +
            '          </div>\n' +
            '          <button type="submit" class="edit-btn ">Подтвердить</button>\n' +
            '        </form>' +
            '              </div>\n' +
            '</div>' +
            '              <div class="right-wrapper">\n' +
            '              <div class="bookinglist">\n' +
            '                <ul class="bookinglist__item tasklist__tasks-list">\n' +
            '                  <li class="bookinglist__item-booking book-adder book-adder__btn">\n' +
            '                      <div class="plus-div">✚</div>\n' +
            '                  </li>\n' +
            '\n' +
            '                </ul>\n' +
            '              </div>\n' +
            '            <div class="flight-info__btn">\n' +
            '              <div class="flight-info__btn red-icon">\n' +
            '              <span class="name-item">\n' +
            '                Изменить \n' +
            '              </span>\n' +
            '              </div>\n' +
            '              <div class="flight-info__btn del-icon">\n' +
            '              <span class="name-item">\n' +
            '                Удалить \n' +
            '              </span>\n' +
            '              </div>\n' +
            '            </div>\n' +
            '            </div>\n' +
            '          </div>';


        const adderElement = document.querySelector('.tasklist-adder');
        adderElement.parentElement.insertBefore(liElement, adderElement);
        let planes = AppModel.getPlanes()
        planes.then(result => {
            let plane = null
            for (plane of result) {
                console.log(plane)
                console.log(document.querySelector('#first-select-' + this.#flightId))
                let opt = document.createElement('option');
                opt.setAttribute('value', plane.id)
                opt.textContent = plane.name

                if (plane.name === this.#flightPlane) {
                    opt.setAttribute('selected', true)

                }

                document.querySelector('#first-select-' + this.#flightId).appendChild(opt)
            }
        })


        liElement.querySelector(".book-adder__btn").addEventListener('click', this.onAddNewPassenger)
        liElement.querySelector(".del-icon").addEventListener('click', this.onDeleteFlight);
        liElement.querySelector(".red-icon").addEventListener('click', this.onEditFlightPress)
        liElement.querySelector('.flight_edit_form')
            .addEventListener('submit', this.onFlightEditSubmit);
    }
};
