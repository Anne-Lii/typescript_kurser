
// Hämtar element från HTML-koden
const courseList: HTMLElement | null = document.getElementById('courseList') as HTMLUListElement;
const courseForm: HTMLFormElement | null = document.getElementById('courseForm') as HTMLFormElement;
const resetBtn: HTMLButtonElement | null = document.getElementById('reset') as HTMLButtonElement | null;

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

        // Lägger till det nya <li> elementet till <ul> listan
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
        courseList.innerHTML = ""; // Rensar befintlig kurslista på webbsidan
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

// Kontroollerar att kurskoden är unik
function isCodeUnique(code: string, courses: courseInfo[]): boolean {
    return !courses.some(course => course.code === code);
}

//eventlistener vid klick på submitknappen
courseForm.addEventListener('submit', function (event: Event) {

    // Förhindrar standardbeteendet för formuläret att skicka data och ladda om sidan
    event.preventDefault();

    // Hämtar värdena från input-fälten och lagrar i variabler
    const nameInput: string = (document.getElementById('courseName') as HTMLInputElement).value;
    const codeInput: string = (document.getElementById('courseCode') as HTMLInputElement).value;
    const urlInput: string = (document.getElementById('url') as HTMLInputElement).value;
    const progressionInput: string = (document.getElementById('prog') as HTMLSelectElement).value;

    // Skapar ett nytt kursobjekt med hjälp av "courseInfo" interfacet
    const newCourse: courseInfo = {
        code: codeInput,
        name: nameInput,
        progression: progressionInput,
        url: urlInput
    };

    //kontrollerar att kurskoden är unik innan kursen läggs till på listan
    const courses: courseInfo[] = getCourses();
    if (!isCodeUnique(newCourse.code, courses)) {
        alert("Kurskoden måste vara unik");
        return;
    }

    displayCourse(newCourse);//anropar funktionen att lägg till kursen i kurslista
    saveCourseToLocalStorage(newCourse);//anropar funktionen för att spara kursen i localstorage
    courseForm.reset();//nollställer formuläret
});


// Funktion för att spara kursen i localStorage
function saveCourseToLocalStorage(course: courseInfo): void {
    const courses: courseInfo[] = getCourses();
    courses.push(course);
    saveCourses(courses);
}

// Funktion som körs vid klick på redigeringsknappen
function editCourse(course: courseInfo): void {

    // Om ett redigerinsformulär för denna kurskod redan finns så tas det bort.
    const existingEditForm = document.getElementById(`editCourseForm-${course.code}`);
    if (existingEditForm) {
        existingEditForm.remove();
    }

    // Skapar ett nytt formulär för redigering
    const editForm = document.createElement('form');
    editForm.id = `editCourseForm-${course.code}`;//ger formuläret ett id
    editForm.setAttribute('data-course-code', course.code); // Sätter data-attributet kurskod på formuläret
    editForm.innerHTML = `
        <input type="text" id="editCourseCode" class="editinput" placeholder="Kurskod" value="${course.code}">
        <input type="text" id="editCourseName" class="editinput" placeholder="Kursnamn" value="${course.name}">
        <input type="url" id="editUrl" class="editinput" placeholder="URL" value="${course.url}">
        <select id="editProg" class="editinput">
            <option value="A" ${course.progression === 'A' ? 'selected' : ''}>A</option>
            <option value="B" ${course.progression === 'B' ? 'selected' : ''}>B</option>
            <option value="C" ${course.progression === 'C' ? 'selected' : ''}>C</option>
        </select>
        <button type="submit" id="updateBtn">Uppdatera</button>
    `;

    // Lägger till formuläret under den valda kursen
    const selectedCourseElement = document.getElementById(`course-${course.code}`);
    if (selectedCourseElement) {
        selectedCourseElement.appendChild(editForm);

        // Lägger till eventlyssnare för formuläret
        editForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Uppdaterar den valda kursens information
            const updatedCourse: courseInfo = {
                code: (document.getElementById('editCourseCode') as HTMLInputElement).value,
                name: (document.getElementById('editCourseName') as HTMLInputElement).value,
                url: (document.getElementById('editUrl') as HTMLInputElement).value,
                progression: (document.getElementById('editProg') as HTMLSelectElement).value
            };

            // Hämtar befintliga kurser, uppdaterar den valda kursen och sparar till localStorage
            let courses: courseInfo[] = getCourses();

            //kontroll om kurskoden är unik annars kommer varning
            if (!isCodeUnique(updatedCourse.code, courses.filter(c => c.code !== course.code))) {
                alert("Kurskoden måste vara unik");
                return;
            }

            //kollar nya kursen och jämför kurskoden, om den nya kurskoden matchar ersätts den gamla med den uppdaterade kursen annars behålls den gamla
            courses = courses.map(c => c.code === course.code ? updatedCourse : c);
            saveCourses(courses);

            // Uppdaterar kurslistan på webbsidan
            updateCourseList(courses);

            // Tar bort redigeringsformuläret
            editForm.remove();
        });
    }
}