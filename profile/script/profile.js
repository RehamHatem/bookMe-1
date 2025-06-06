import { getAllUsers, updateUser } from "../../firebase.js";
import { 
  getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { navBarButton } from "../../navBar/script/navBar.js";

function getUserId() {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); 
      } else {
        resolve(null); 
      }
    });
  });
}

// DOM Elements
const emailInput = document.getElementById("emailInput");
const userNameInput = document.getElementById("usernameInput");
const updateBtn = document.getElementById("updateButton");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/; 
  return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", async () => {
  const editProfileBtn = document.getElementById("editProfileBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const content = document.getElementById("content");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      content.classList.add("loaded");
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace("../../index.html");
    });
  }

  try {
    const id = await getUserId();
    if (!id) {
      window.location.href = "../../index.html";
      return;
    }

    const allUsers = await getAllUsers();
    const currentUser = allUsers.find((user) => user.uid === id);

    if (currentUser) {
      emailInput.value = currentUser.email;
      userNameInput.value = currentUser.name;

      updateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const newEmail = emailInput.value;
        const newName = userNameInput.value;

        if (!isValidEmail(newEmail)) {
          alert("Please enter a valid .com email address.");
          return;
        }

        const emailExists = allUsers.some(
          (user) => user.email === newEmail && user.uid !== id
        );

        if (emailExists) {
          alert("This email is already used by another account.");
          return;
        }

        await updateUser(currentUser.id, {
          email: newEmail,
          name: newName,
        });

        alert("Profile updated!");
      });
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

navBarButton();
