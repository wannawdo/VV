<template>
  <div class="pagina-profil">
    <header class="jumbotronn">
      <h3 class="info">
        Informații despre cont
      </h3>
    </header>

    <div class="divForms">
      <div class="profile">
        <figure class="snip1336">
          <img v-bind:src="imageurl" />
          <figcaption>
            <h2>
              {{ currentUser.name
              }}<span>Username: {{ currentUser.username }}</span>
            </h2>
            <p>E-mail: {{ currentUser.email }}</p>
            <div class="options">
              <a href="#" class="follow" @click="editAccount">Editează cont</a>
              <a href="#" class="follow" @click="deleteAccount">Șterge cont</a>
            </div>

            <div v-if="showVotantBoard()" class="cb">
              <label class="adauga-cerere" v-if="!checked"
                ><center><strong>Doresc să devin candidat:</strong></center>
              </label>
              <input type="checkbox" id="checkbox" v-model="checked" />
              <label for="checkbox">
                <div class="field" v-if="checked">
                  <label for="file" class="label">
                    <strong>Te rugăm să adaugi cererea aici:</strong></label
                  >
                  <input type="file" ref="file" @change="selectFile" />
                  <center>
                    <a href="#" class="follow" @click="submitRequest"
                      >Trimite cererea</a
                    >
                  </center>
                </div>
              </label>
            </div>
          </figcaption>
        </figure>
      </div>

      <div class="col-md-12" v-if="showForm">
        <div class="card card-container">
          <img
            id="profile-img"
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            class="profile-img-card"
          />
          <form
            @submit.prevent="submitChanges"
            enctype="multipart/form-data"
            name="form"
          >
            <div v-if="!successful">
              <div class="form-group">
                <label for="name"><strong>Nume</strong></label>
                <input
                  v-model="userFields.name"
                  v-validate="'required|min:3|max:20'"
                  type="text"
                  class="form-control"
                  name="name"
                />
                <div
                  v-if="submitted && errors.has('username')"
                  class="alert-danger"
                >
                  {{ errors.first("username") }}
                </div>
              </div>
              <div class="form-group">
                <label for="username"
                  ><strong>Nume de utilizator</strong></label
                >
                <input
                  v-model="userFields.username"
                  v-validate="'required|min:3|max:20'"
                  type="text"
                  class="form-control"
                  readonly
                  name="username"
                />
                <div
                  v-if="submitted && errors.has('username')"
                  class="alert-danger"
                >
                  {{ errors.first("username") }}
                </div>
              </div>
              <div class="form-group">
                <label for="email"><strong>Email</strong></label>
                <input
                  v-model="userFields.email"
                  v-validate="'required|email|max:50'"
                  type="email"
                  class="form-control"
                  name="email"
                />
                <div
                  v-if="submitted && errors.has('email')"
                  class="alert-danger"
                >
                  {{ errors.first("email") }}
                </div>
              </div>
              <div class="form-group">
                <label for="password"><strong>Parolă</strong></label>
                <input
                  v-model="userFields.password"
                  v-validate="'required|min:6|max:40'"
                  type="password"
                  class="form-control"
                  name="password"
                />
                <div
                  v-if="submitted && errors.has('password')"
                  class="alert-danger"
                >
                  {{ errors.first("password") }}
                </div>
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block">
                  <strong>Editeaza cont</strong>
                </button>
              </div>
            </div>
          </form>

          <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "../models/user";
import md5 from "md5";
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      content: "",
      imageurl:
        "https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg",
      checked: false,
      user: new User("", "", "", ""),
      submitted: false,
      successful: false,
      message: "",
      userFields: {},
      showForm: false,
      file: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    } else {
      this.userFields = JSON.parse(JSON.stringify(this.$store.state.auth.user));
      this.userFields.password = "";
      this.imageurl =
        "https://www.gravatar.com/avatar/" +
        md5(this.currentUser.email) +
        "?s=600&d=mp";
    }
  },
  methods: {
    submitRequest() {
      if (confirm("Sunteți sigur că doriți să trimiteți cererea?")) {
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append(
          "accessToken",
          JSON.parse(window.localStorage.getItem("user")).accessToken
        );
        axios.post(
          "http://" + window.location.hostname + ":8080/user/request",
          formData
        );
      }
    },
    submitChanges() {
      if (confirm("Sunteți sigur că doriți să editați contul?")) {
        axios
          .post("http://" + window.location.hostname + ":8080/user/update", {
            accessToken: JSON.parse(window.localStorage.getItem("user"))
              .accessToken,
            username: this.userFields.username,
            password: this.userFields.password,
            full_name: this.userFields.name,
            email: this.userFields.email,
          })
          .then(() => {
            this.$store.dispatch("auth/logout");
            this.$router.push("/login");
          });
      }
    },
    showVotantBoard() {
      console.log(this.currentUser);
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE = VOTANT");
      }
      return false;
    },
    editAccount() {
      this.showForm = true;
    },
    deleteAccount() {
      if (confirm("Sunteți sigur că doriți să ștergeți contul?")) {
        axios
          .delete(
            "http://" +
              window.location.hostname +
              ":8080/user/" +
              JSON.parse(window.localStorage.getItem("user")).accessToken
          )
          .then(() => {
            this.$store.dispatch("auth/logout");
            this.$router.push("/login");
          });
      }
    },
    selectFile() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:300, 400, 600");
.snip1336 {
  font-family: "Roboto", Arial, sans-serif;
  position: relative;
  overflow: hidden;
  margin: auto;
  min-width: 330px;
  min-height: 650px;
  width: 100%;
  color: #ffffff;
  text-align: left;
  line-height: 1.4em;
  background-color: #141414;
}
.snip1336 * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.snip1336 img {
  max-width: 100%;
  vertical-align: top;
  opacity: 0.85;
}
.snip1336 figcaption {
  width: 100%;
  background-color: #141414;
  padding: 25px;
  position: relative;
}
.snip1336 figcaption:before {
  position: absolute;
  content: "";
  bottom: 100%;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 55px 0 0 400px;
  border-color: transparent transparent transparent #141414;
}
.snip1336 figcaption a {
  padding: 5px;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-size: 0.7em;
  text-transform: uppercase;
  margin: 10px 0;
  display: inline-block;
  opacity: 0.65;
  width: 47%;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
}
.snip1336 figcaption a:hover {
  opacity: 1;
}
.snip1336 .profile {
  border-radius: 50%;
  position: absolute;
  bottom: 100%;
  left: 25px;
  z-index: 1;
  max-width: 90px;
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  flex: 1;
}
.snip1336 .follow {
  margin-right: 4%;
  border-color: #2980b9;
  color: #2980b9;
}
.snip1336 h2 {
  margin: 0 0 5px;
  font-weight: 300;
}
.snip1336 h2 span {
  display: block;
  font-size: 0.5em;
  color: #2980b9;
}
.snip1336 p {
  margin: 0 0 10px;
  font-size: 0.8em;
  letter-spacing: 1px;
  opacity: 0.8;
}

body {
  background-color: #212121;
}
figure {
  border-radius: 25px;
  border: 2px solid #011f4b;
  box-shadow: 5px 10px 10px #011f4b;
}
.cartonase {
  margin-top: 5%;
  text-align: center;
}

@keyframes zoominoutsinglefeatured {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.1, 1.1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.jumbotronn {
  animation: zoominoutsinglefeatured 7s;
  border-radius: 25px;
  border: 2px solid #011f4b;
  background-color: #b3cde0;
  box-shadow: 5px 5px 10px #011f4b;
  width: 60%;
  margin: auto;
  margin-top: 5%;
}
.info {
  text-align: center;
  text-shadow: 1px 1px;
}
.profile {
  margin-top: 3%;
  max-width: 330px;
  max-height: 650;
}
.options {
  display: flex;
  justify-content: center;
}
.btnn {
  padding: 1%;
  margin-top: 2%;
  border-radius: 25px;
  border: 2px solid #2980b9;
  background-color: #2980b9;
  margin-top: 5%;
}
span {
  text-color: white;
}
.cb {
  border: 2px solid #2980b9;
  border-radius: 10%;
  padding: 1%;
  padding-top: 3%;
}
.pagina-profil {
  margin: auto;
  align-items: center;
}

label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.field {
  margin-bottom: 5%;
  display: block;
  width: 100%;
}
.card-container {
  background-color: #b3cde0;
}
input {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 20px;
  width: 100%;
}
button {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 20px;
  background-color: #011f4b;
}
img {
  border-radius: 25px;
  border: 2px solid #011f4b;
}
.card-container {
  border-radius: 25px;
  border: 2px solid #011f4b;
  box-shadow: 7px 10px 10px #011f4b;
}

.divForms {
  display: flex;

  align-items: center;
  justify-content: flex-start;
}
</style>
