
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

//funktion för att skriva ut kurserna till webbsidan
function displayCourse(course: courseInfo): void {

    if (courseList) {

        // Skapa ett nytt <li> element
        const listItem: HTMLLIElement = document.createElement('li');

        // Vad som ska skrivas ut i det nya <li> elementet
        listItem.id = `course-${course.code}`;
        listItem.innerHTML += `
        <strong>${course.code}</strong> - <strong >${course.name}</strong> <br>
        Progression:${course.progression} <br>
         <a href="${course.url}">${course.url}</a>
         <button class="edit">Redigera</button>
        `;

        // Lägg till det nya <li> elementet till <ul> listan
        courseList.appendChild(listItem);

         // Eventlyssnare för klick på redigeringsknappen
         const editBtn: HTMLButtonElement | null = listItem.querySelector('.edit');
         if (editBtn) {
             editBtn.addEventListener('click', () => {
                 editCourse(course);
             });
         }
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

// Validera att kurskoden är unik
function isCodeUnique(code: string, courses: courseInfo[]): boolean {
    return !courses.some(course => course.code === code);
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

    //validera att kurskod är unik innan kursen läggs till på lista
    const courses:courseInfo[] = getCourses();
    if (!isCodeUnique(newCourse.code, courses)) {
        alert("Kurskoden måste vara unik");
        return;
    }

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

// Funktion som körs vid klick på redigeringsknappen
function editCourse(course: courseInfo): void {

    //tar bort eventuella redigeringsformulär
    const existingEditForm = document.getElementById("editCourseForm");
    if(existingEditForm) {
        existingEditForm.remove();
    }

    // Skapar ett nytt formulär för redigering
    const editForm = document.createElement('form');
    editForm.id = `editCourseForm-${course.code}`;  // Lägger till ett id till forumläret
    editForm.innerHTML = `
    <input type="text" id="editCourseCode" class="editinput" placeholder="Kurskod" value="${course.code}">
        <input type="text" id="editCourseName" class="editinput" "placeholder="Kursnamn" value="${course.name}">
        <input type="url" id="editUrl" class="editinput" placeholder="URL" value="${course.url}">
        <select id="editProg" class="editinput">
            <option value="A" ${course.progression === 'A' ? 'selected' : ''}>A</option>
            <option value="B" ${course.progression === 'B' ? 'selected' : ''}>B</option>
            <option value="C" ${course.progression === 'C' ? 'selected' : ''}>C</option>
        </select>
        <button type="submit" id="updateBtn">Uppdatera</button>
    `;

    // Sätter ett data-attribut med kurskoden
    editForm.setAttribute('data-course-code', course.code);
    
    // Lägg till formuläret under den valda kursen
    const selectedCourseElement = document.getElementById(`course-${course.code}`);
    if (selectedCourseElement) {
        selectedCourseElement.appendChild(editForm);
        
        // Lägg till eventlyssnare för formuläret
        editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Hämta data-attributet för kurskoden
            const courseCode = editForm.getAttribute('data-course-code');

            // Uppdatera den valda kursens information
            course.name = (document.getElementById('editCourseName') as HTMLInputElement).value;
            course.code = (document.getElementById('editCourseCode') as HTMLInputElement).value;
            course.url = (document.getElementById('editUrl') as HTMLInputElement).value;
            course.progression = (document.getElementById('editProg') as HTMLSelectElement).value;

            // Hämta befintliga kurser, uppdatera den valda kursen och spara till localStorage
            const courses: courseInfo[] = getCourses();

            //validera att kurskoden är unik innan kursen uppdateras
            if (!isCodeUnique(course.code, courses.filter(c=> c.code !== courseCode))) {
                alert("Kurskoden måste vara unik");
                return;
            }

            const updatedCourses = courses.map(c => c.code === courseCode ? course : c);
            saveCourses(updatedCourses);

            // Uppdatera kurslistan på webbsidan
            updateCourseList(updatedCourses);
            
            // Ta bort redigeringsformuläret
            editForm.remove();
        });
    }
}