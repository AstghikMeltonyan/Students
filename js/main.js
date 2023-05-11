class Student {
  constructor(name, surname, lastname, studyStart, birthDate, faculty) {
    this.name = name
    this.surname = surname
    this.lastname = lastname
    this.studyStart = studyStart
    this.birthDate = birthDate
    this.faculty = faculty
  }

  get fio() {
    return this.surname + ' ' + this.name + ' ' + this.lastname
  }

  get studyEnd() {
    return this.studyStart + 4
  }

  getStudyPeriod() {
    const currentYear = new Date().getFullYear()
    return currentYear - this.studyStart
  }

  getBirthDate() {
    let year = this.birthDate.getFullYear();
    let month = this.birthDate.getMonth();
    let day = this.birthDate.getDate();
    day < 10 ? day = '0' + day : day;
    month < 10 ? month = '0' + month : month;
    return day + '.' + month + '.' + year;
  }

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    let m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age
  }
}

const students = [
  new Student('Олег', 'Иванов', 'Иванович', 2011, new Date(1995, 10, 9), 'Экономический'),
  new Student('Наталья', 'Румянцева', 'Владимировна', 2020, new Date(2000, 4, 24), 'Журналистики'),
  new Student('Владимир', 'Беляков', 'Вадимович', 2018, new Date(1994, 6, 26), 'Компьютерных наук'),
  new Student('Наталья', 'Волкова', 'Андреевна', 2021, new Date(2002, 8, 24), 'Биологии'),
  new Student('Олег', 'Беляков', 'Вадимович', 2017, new Date(1994, 3, 2), 'Компьютерных наук')
]

const studentsList = document.getElementById('student-list');
const studentsListTHAll = document.querySelectorAll('.studentsTable th');
const inputs = document.querySelectorAll('form .form-control');
const sort = document.querySelectorAll('.studentsTable .sort_btn')

let columnDir = true,
  column;

function newStudentTR(student) {
  const studentTR = document.createElement('tr'),
    fioTD = document.createElement('td'),
    birthDateTD = document.createElement('td'),
    studyStartTD = document.createElement('td'),
    facultyTD = document.createElement('td');

  fioTD.textContent = student.fio;
  birthDateTD.textContent = student.getBirthDate() + ' (' + student.getAge() + ' лет )';

  if (student.getStudyPeriod() > 4 || student.getStudyPeriod() === 4 && (new Date().getMonth() + 1) > 9) {
    studyStartTD.textContent = student.studyStart + '-' + (student.studyStart + 4) + '( Закончил )'
  } else {
    studyStartTD.textContent = student.studyStart + '-' + (student.studyStart + 4) + ' (' + student.getStudyPeriod() + ' курс)'
  }
  facultyTD.textContent = student.faculty;

  studentTR.append(fioTD);
  studentTR.append(birthDateTD)
  studentTR.append(studyStartTD)
  studentTR.append(facultyTD)

  return studentTR
}

function getSortStudents(prop, dir) {
  const studentsCopy = [...students]

  return studentsCopy.sort(function (studentA, studentB) {
    if ((!dir == false ? studentA[prop] < studentB[prop] : studentA[prop] > studentB[prop]))
      return -1;
  })
}

sort.forEach(element => {
  element.addEventListener('click', function () {
    column = this.dataset.column;
    columnDir = !columnDir
    render()
  })
});

function render() {
  let studentsCopy = [...students];
  console.log(studentsCopy);

  studentsCopy = getSortStudents(column, columnDir);
  console.log(studentsCopy);

  studentsList.innerHTML = '';

  for (const student of studentsCopy) {
    studentsList.append(newStudentTR(student))
  }
}
console.log(inputs);
function getTodayDate() {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  day < 10 ? day = '0' + day : day;
  month < 10 ? month = '0' + month : month;
  return day + '.' + month + '.' + year;
}

document.getElementById('add-student').addEventListener('submit', function (e) {
  e.preventDefault()

  const errorsMap = {
    name: 'Заполните имя студента',
    surname: 'Фамилия студента должна быть заполнена',
    patronymic: 'Заполните отчество',
    birthday: 'Когда студент родился?',
    education_start: 'Год начала обучения?',
    faculty: 'На каком факультете?'
  };

  for (let input of inputs) {
    if (!input.value.trim()) return
    console.log(input);
  
  }

  let dateLimit = new Date(document.getElementById('input-birthDate').value).getFullYear();
  let studyStart = Number(document.getElementById('input-studyStart').value);
  let stratErr = document.querySelector('.study-error');
  let birthErr = document.querySelector('.birth-error')

  if (studyStart < 2000 || studyStart > new Date().getFullYear()) {
    document.getElementById('input-studyStart').classList.add('border-danger')

    stratErr.classList.add('text-danger')
    stratErr.textContent = `Введите число в диапазоне от 2000г до ${new Date().getFullYear()}`;
    return
  } else {
    document.getElementById('input-studyStart').classList.remove('border-danger')
    stratErr.textContent = '';
  }

  if (dateLimit < 1900 || dateLimit > new Date().getFullYear()) {
    document.getElementById('input-birthDate').classList.add('border-danger')
    birthErr.classList.add('text-danger')
    birthErr.textContent = `Введите число в диапазоне от 01.01.1900г до ${getTodayDate()}`;
    return
  } else {
    document.getElementById('input-birthDate').classList.remove('border-danger')
    birthErr.textContent = '';
  }
  addTrueStudent()

  function addTrueStudent() {
    students.push(new Student(
      document.getElementById('input-name').value,
      document.getElementById('input-surname').value,
      document.getElementById('input-lastname').value,
      Number(document.getElementById('input-studyStart').value),
      new Date(document.getElementById('input-birthDate').value),
      document.getElementById('input-faculty').value,
    ))
  }
  for (let input of inputs) {
    input.value = '';
  }
  render()
})

function filter(students, prop, value) {
  let copyStudents = [...students]
  let studentsFilteredList = copyStudents.filter(student => (String(student[prop]).includes(value) === true))
  return studentsFilteredList
}

function filterStudent(students) {
  studentsList.innerHTML = ''
  const fioValue = document.getElementById('search-fio').value,
    studyStartValue = document.getElementById('search-start-study').value,
    endStudyValue = document.getElementById('search-end-study').value,
    facultyValue = document.getElementById('search-faculty').value;

  let studentsFilter = [...students]

  studentsFilter = filter(studentsFilter, 'fio', fioValue)
  studentsFilter = filter(studentsFilter, 'studyStart', studyStartValue)
  studentsFilter = filter(studentsFilter, 'studyEnd', endStudyValue)
  studentsFilter = filter(studentsFilter, 'faculty', facultyValue)

  for (const student of studentsFilter) {
    studentsList.append(newStudentTR(student))
  }
}

document.querySelectorAll('.input-group').forEach(el => {
  el.addEventListener('input', function(){
    filterStudent(students)
  })
})

render()
