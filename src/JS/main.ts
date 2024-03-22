
// Hämtar element från HTML-koden
const courseList: HTMLElement | null = document.getElementById('courseList');
const courseForm: HTMLFormElement | null = document.getElementById('courseForm') as HTMLFormElement;

//Interface som definierar strukturen för ett nytt kursobjekt
interface courseInfo {
    code: string;
    name: string;
    progression: string;
    url: string;
}

//funktion som hämtar kurser från local storage
function getCourses(): courseInfo[] {
    const courseJSON: string | null = localStorage.getItem("courses");
    return courseJSON ? JSON.parse(courseJSON) : [];
}

//funktion som sparar kurser till localstorage
function saveCourses(courses: courseInfo[]): void {
    localStorage.setItem("courses", JSON.stringify(courses));
}

//när sidan laddas skrivs sparade kurser ut
window.addEventListener("load", () => {
    const courses: courseInfo[] = getCourses();
    courses.forEach(course => {
        displayCourse(course);
    });
});

//funktion för att visa upp kurser
function displayCourse(course: courseInfo): void {

    if (courseList) {

        // Skapa ett nytt <li> element
        const listItem: HTMLLIElement = document.createElement('li');

        // Vad som ska skrivas ut i det nya <li> elementet
        listItem.innerHTML += `
        <strong>${course.code}</strong> - <strong >${course.name}</strong> <br>
        Progression:${course.progression} <br>
         <a href="${course.url}">${course.url}</a>
         
        `;

        // Lägg till det nya <li> elementet till <ul> listan
        courseList.appendChild(listItem);
    }
}

// Funktion för att uppdatera listan med kurser på sidan
function updateCourseList(courses: courseInfo[]): void {

    saveCourses(courses); // sparar kurserna till localstorage

    if (courseList) {
        courseList.innerHTML = ""; // Rensa befintlig kurslista på webbsidan
        courses.forEach(course => {//loopar igenom och visar alla befintliga kurser på websidan
            displayCourse(course);
        });
    }
}

//rensar listan på sidan och localstorage vid klick på knappen "Ta bort alla kurser"
const deleteBtn: HTMLButtonElement | null = document.getElementById("clear") as HTMLButtonElement | null;

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        if (courseList) {
            courseList.innerHTML = "";
        }
        saveCourses([]); // rensar localStorage        
    });
}

//eventlistener vid klick på submitknappen
courseForm.addEventListener('submit', function (event: Event) {

    // Förhindra standardbeteendet för formuläret att skicka data och ladda om sidan
    event.preventDefault();

    // Hämta värdena från input-fälten och lagra i variabler
    const nameInput: string = (document.getElementById('courseName') as HTMLInputElement).value;
    const codeInput: string = (document.getElementById('courseCode') as HTMLInputElement).value;
    const urlInput: string = (document.getElementById('url') as HTMLInputElement).value;
    const progressionInput: string = (document.getElementById('prog') as HTMLSelectElement).value;

    // Skapa ett nytt kursobjekt med hjälp av "courseInfo" interfacet
    const newCourse: courseInfo = {
        code: codeInput,
        name: nameInput,
        progression: progressionInput,
        url: urlInput
    };

    displayCourse(newCourse);//anropar funktionen att lägg till kursen i kurslista
    saveCourseToLocalStorage(newCourse);//anropar funktionen för att spara kursen i localstorage
    courseForm.reset();//nollställ formuläret
});

// Funktion för att spara kursen i localStorage
function saveCourseToLocalStorage(course: courseInfo): void {
    const courses: courseInfo[] = getCourses();
    courses.push(course);
    saveCourses(courses);
}