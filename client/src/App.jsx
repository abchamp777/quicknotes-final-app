import "./styles/App.css";

import { useState, useEffect } from "react";

import { auth, db } from "./firebase";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged,
GoogleAuthProvider,
signInWithPopup
} from "firebase/auth";

import {
collection,
addDoc,
query,
where,
getDocs,
deleteDoc,
doc,
updateDoc
} from "firebase/firestore";

export default function App(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [user,setUser]=useState(null);

const [text,setText]=useState("");

const [notes,setNotes]=useState([]);

const [search,setSearch]=useState("");

const [editing,setEditing]=useState(null);

const [dark,setDark]=useState(true);

const [category,setCategory]=useState("General");

const [favoriteOnly,setFavoriteOnly]=useState(false);

const provider=new GoogleAuthProvider();

useEffect(()=>{

const unsub=
onAuthStateChanged(
auth,
(u)=>{

setUser(u);

if(u){
loadNotes(u.uid);
}

}
);

return ()=>unsub();

},[]);

async function loadNotes(uid){

const q=query(
collection(db,"notes"),
where(
"uid",
"==",
uid
)
);

const snap=
await getDocs(q);

setNotes(

snap.docs.map(
d=>({
id:d.id,
...d.data()
})
)

);

}

async function signup(){

try{

await createUserWithEmailAndPassword(
auth,
email.trim(),
password
);

alert("Account created");

}

catch(err){

alert(err.message);

}

}

async function login(){

try{

await signInWithEmailAndPassword(
auth,
email.trim(),
password
);

alert("Logged in");

}

catch(err){

alert(err.message);

}

}

async function googleLogin(){

try{

await signInWithPopup(
auth,
provider
);

}

catch(err){

alert(err.message);

}

}

async function addNote(){

if(!text.trim())
return;

await addDoc(

collection(
db,
"notes"
),

{

uid:user.uid,

text,

category,

favorite:false,

created:Date.now()

}

);

setText("");

loadNotes(
user.uid
);

}

async function remove(id){

await deleteDoc(

doc(
db,
"notes",
id
)

);

loadNotes(
user.uid
);

}

async function saveEdit(id){

await updateDoc(

doc(
db,
"notes",
id
),

{
text
}

);

setEditing(null);

setText("");

loadNotes(
user.uid
);

}

async function toggleFavorite(note){

await updateDoc(

doc(
db,
"notes",
note.id
),

{

favorite:
!note.favorite

}

);

loadNotes(
user.uid
);

}

function exportNotes(){

const file=

notes

.map(
n=>

`[${n.category}] ${n.text}`

)

.join("\n\n");

const blob=
new Blob([file]);

const a=
document.createElement("a");

a.href=
URL.createObjectURL(blob);

a.download=
"notes.txt";

a.click();

}

if(!user){

return(

<div className="app">

<h1>

QuickNotes

</h1>

<input

value={email}

placeholder="Email"

onChange={
(e)=>
setEmail(
e.target.value
)
}

/>

<input

value={password}

type="password"

placeholder="Password"

onChange={
(e)=>
setPassword(
e.target.value
)
}

/>

<button onClick={signup}>
Sign Up
</button>

<button onClick={login}>
Login
</button>

<button onClick={googleLogin}>
Continue With Google
</button>

</div>

);

}

return(

<div className={dark?"app dark":"app"}>

<div className="header">

<div>

<h1>

☁ QuickNotes

</h1>

<p>

{user.email}

</p>

</div>

<div>

<button
onClick={()=>
setDark(
!dark
)
}
>

Theme

</button>

<button
onClick={exportNotes}
>

Export

</button>

<button
onClick={()=>
signOut(
auth
)
}
>

Logout

</button>

</div>

</div>

<div className="stats">

<div>

Notes

<br/>

{notes.length}

</div>

<div>

Favorites

<br/>

{

notes.filter(
n=>
n.favorite
).length

}

</div>

</div>

<input

placeholder="Search"

value={search}

onChange={
(e)=>
setSearch(
e.target.value
)
}

/>

<button

onClick={()=>

setFavoriteOnly(
!favoriteOnly
)

}

>

{

favoriteOnly

?

"Show All"

:

"Favorites"

}

</button>

<select

value={category}

onChange={
(e)=>
setCategory(
e.target.value
)
}

>

<option>General</option>

<option>School</option>

<option>Ideas</option>

<option>Work</option>

</select>

<textarea

className="noteInput"

value={text}

placeholder="Write note..."

onChange={
(e)=>
setText(
e.target.value
)
}

/>

<button

className="addBtn"

onClick={

editing

?

()=>saveEdit(
editing
)

:

addNote

}

>

{

editing

?

"Save"

:

"Add Note"

}

</button>

<div className="notes">

{

notes

.filter(

n=>

favoriteOnly

?

n.favorite

:

true

)

.filter(

n=>

n.text

.toLowerCase()

.includes(

search

.toLowerCase()

)

)

.map(
n=>(

<div
key={n.id}
className="card"
>

<button

onClick={()=>

toggleFavorite(
n
)

}

>

{

n.favorite

?

"⭐"

:

"☆"

}

</button>

<p>

[{n.category}]

</p>

<p>

{n.text}

</p>

<button

onClick={()=>{
setEditing(
n.id
);

setText(
n.text
);

}}

>

Edit

</button>

<button

className="delete"

onClick={()=>
remove(
n.id
)
}

>

Delete

</button>

</div>

)

)

}

</div>

</div>

);

}