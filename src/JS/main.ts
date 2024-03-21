
// Hämtar element från HTML-koden
const courseList: HTMLElement | null = document.getElementById('courseList');
const courseForm: HTMLFormElement | null = document.getElementById('courseForm') as HTMLFormElement;

interface courseInfo {
    name: string;
    code: string;
    url: string;
    progression: string;
}

//funktion som hämtar kurser från local storage
function getCourses(): courseInfo[] {
    const courseJSON: string | null = localStorage.getItem("courses");
    if (courseJSON) {
        return JSON.parse(courseJSON);
    } else {
        return []
    }
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
    })
});

//funktion för att visa upp kurser
function displayCourse(course: courseInfo): void {

    if (courseList) {

        // Skapa ett nytt <li> element
        const listItem: HTMLLIElement = document.createElement('li');

        // Vad som ska skrivas ut i det nya <li> elementet
        listItem.innerHTML += `
        <strong contenteditable>${course.code}</strong> - <strong contenteditable>${course.name}</strong> <br>
        Progression: <span contenteditable>${course.progression}</span contenteditable> <br>
         <a href="${course.url}" contenteditable>${course.url}</a>
        `;

        // Lägg till det nya <li> elementet till <ul> listan
        courseList.appendChild(listItem);

        const editBtn: HTMLButtonElement | null = listItem.querySelector(".edit");
        if (editBtn) {
        editBtn.addEventListener("click", () => {
           
        });
        }
    }
}

function deleteCourse(course:courseInfo): void {
    const courses: courseInfo[] = getCourses();
    const updateCourses: courseInfo[] = courses.filter (c => c.code!== course.code);
    saveCourses(updateCourses)

    // Uppdatera kurserna på sidan om den aktuella kursen tas bort
    updateCourseList(updateCourses);
}

// Funktion för att uppdatera listan med kurser på sidan
function updateCourseList(courses: courseInfo[]): void {
    if (courseList) {
        courseList.innerHTML = ""; // Rensa befintlig kurslista
        courses.forEach(course => {
            displayCourse(course);
        });
    }
}

courseForm.addEventListener('submit', function (event: Event) {

    // Förhindra standardbeteendet för formuläret att skicka data och ladda om sidan
    event.preventDefault();

    // Hämta värdena från input-fälten och lagra i variabler
    const nameInput: string = (document.getElementById('courseName') as HTMLInputElement).value;
    const codeInput: string = (document.getElementById('courseCode') as HTMLInputElement).value;
    const urlInput: string = (document.getElementById('url') as HTMLInputElement).value;
    const progressionInput: string = (document.getElementById('prog') as HTMLSelectElement).value;

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

//funktionen för att spara kursen i storage
function saveCourseToLocalStorage(course: courseInfo): void{
    const coursesInStorage:string | null = localStorage.getItem("courses");
    let courses: courseInfo[] = [];

    if (coursesInStorage) {
        try {
            courses = JSON.parse(coursesInStorage);
        } catch (error) {
            console.error();
        }
    }

    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
}
//funktion som körs när ändringar görs vid input
document.addEventListener("input", function(event) {
    const edited = event.target;

    // Kontrollera om det redigerbara elementet har ett data-key-attribut
    const dataKey = edited.getAttribute('data-key');
    if (dataKey) {
        // Spara det uppdaterade innehållet i localStorage
        localStorage.setItem(dataKey, edited.innerHTML);
    }
});

// Ladda in sparade data från localStorage när sidan laddas
window.addEventListener('load', function() {
    // Hämta alla redigerbara element
    const editableElements = document.querySelectorAll('[contenteditable]');
    
    // Gå igenom varje redigerbart element och hämta dess sparade värde från localStorage
    editableElements.forEach(function(element) {
        const savedValue = localStorage.getItem(element.getAttribute('data-key'));
        if (savedValue) {
            element.innerHTML = savedValue;
        }
    });
});