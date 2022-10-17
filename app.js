// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-analytics.js";
import { getDatabase, ref, set,onValue, remove  } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC01tax0GBWPC3J2an-kWEKgXXoV6BBrqg",
  authDomain: "test-fb-2c95d.firebaseapp.com",
  projectId: "test-fb-2c95d",
  storageBucket: "test-fb-2c95d.appspot.com",
  messagingSenderId: "753699389401",
  appId: "1:753699389401:web:a8265015228a746699e3c8",
  measurementId: "G-NRXZKDG46V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());
let dataLength;

function writeUserData( name, email, userid) {
    const db = getDatabase();
    set(ref(db, 'person/'+ userid), {
        id: userid,
        username: name,
        email: email,
    });
}
// modal init
const myModal = new bootstrap.Modal('#exampleModal');

// delete data
const deleteData = () => {
    document.querySelectorAll(".delete").forEach( el => {
        el.addEventListener("click", function(){
            const id = parseInt(this.getAttribute('data-serial'));
            remove(ref(getDatabase(), "person/"+id));
        })
    });
}

// update data
const saveEdited = () => {
    document.querySelector('.save-edited').addEventListener('click', async function(){
        const userName = this.closest('.modal-content').querySelector("#usernameEdit").value;
        const userEmail = this.closest('.modal-content').querySelector("#useremailEdit").value;
        const userId = this.getAttribute('data-serial');
        await updateData(userName, userEmail, userId);
        myModal.hide();
    })
}
const updateModal = () => {
    document.querySelectorAll('.edit').forEach( el => {
        el.addEventListener('click', function(){
            const userName = this.closest('tr').querySelectorAll('td')[1].innerText;
            const userEmail = this.closest('tr').querySelectorAll('td')[2].innerText;
            // console.log(userName, userEmail);
            document.querySelector('.modal-content').innerHTML = 
        `
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit User Details</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="usernameEdit" class="form-label">Name</label>
                    <input type="text" value="${userName}" class="form-control" id="usernameEdit" aria-describedby="emailHelp">
                </div>
                <div class="mb-3">
                    <label for="useremailEdit" class="form-label">Email</label>
                    <input type="text" value="${userEmail}" class="form-control" id="useremailEdit">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" data-serial="${this.getAttribute('data-serial')}" class="btn btn-primary save-edited">Save changes</button>
            </div>
        `; 
        saveEdited();
        })
    })
}
const updateData = async(name, email, id) => {
    const saved = await set(ref(db, 'person/' + id), {
        username: name,
        email: email,
        id: id
      })
    
    return saved;
}

// create table on home page
const updateTableRow = (name, email, id) => {
    const tbody = document.querySelector('tbody');
    const tr = document.createElement('tr');

    const lastSerialNum = parseInt(document.querySelector('tbody tr:last-child td:first-child')?.innerText || 0);
    const tableSerial = document.createElement('td');
    tableSerial.classList.add('serial');
    tableSerial.innerText = lastSerialNum+1;

    const userName = document.createElement('td');
    userName.innerText = name;

    const userEmail = document.createElement('td');
    userEmail.innerText = email;

    const actionButton = document.createElement('td');
    actionButton.innerHTML = `
    <button data-serial="${id}" class="btn btn-danger delete">Delete</button>
    <button 
        data-serial="${id}"
        type="button" 
        class="btn btn-primary edit"
        data-bs-toggle="modal" 
        data-bs-target="#exampleModal">
            Edit
    </button>`;
    
    
    tr.append(tableSerial);
    tr.append(userName);
    tr.append(userEmail);
    tr.append(actionButton);
    tbody.append(tr);
    deleteData();
    updateModal();
    
    
}

const db = getDatabase();
const starCountRef = ref(db, 'person');
onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    dataLength = Object.values(data || {})?.length;
    document.querySelector('tbody').innerHTML = '';
    Object.values((data || [{username: 'Not Found', email: "Not Found", id: "NaN"}])).forEach( el => updateTableRow(el.username, el.email, el.id));
});







document.querySelector('form').addEventListener("submit", (e)=> {
    e.preventDefault();
    const name = document.getElementById("username");
    const email = document.getElementById("useremail");
    writeUserData(name.value, email.value, dataLength+1);
    name.value = '';
    email.value = '';
});

