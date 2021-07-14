<template>
  <div class="pagina-gestionare-conturi">
    <header class="jumbotronn">
      <h3 class="info">
        Informații despre cont
      </h3>
    </header>
    <div class="list row">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Căutați un cont după nume"
          v-model="name"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="searchName"
          >
            Caută
          </button>
        </div>
      </div>

      <div class="col-md-8"></div>
      <div class="col-md-6">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ active: index == currentIndex }"
            v-for="(user, index) in users"
            :key="index"
            @click="setActiveUser(user, index)"
          >
            {{ user.name }} - {{ user.active ? "Activ" : "Inactiv" }}
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <div class="col-md-6-1">
          <div v-if="currentUser">
            <h4>Utilizator selectat</h4>
            <div>
              <label><strong>Nume:</strong></label> {{ currentUser.name }}
            </div>
            <div>
              <label><strong>E-mail:</strong></label> {{ currentUser.email }}
            </div>
            <!-- <div>
          <label><strong>Status:</strong></label> {{ currentUser.published ? "Published" : "Pending" }}
        </div> -->
          </div>
          <div v-else>
            <br />
            <p class="select">Selectează un candidat...</p>
          </div>
          <div class="form-group-crearecont">
            <button
              class="btnn btn-primary btn-block"
              :disabled="loading"
              @click="acceptUser"
            >
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span><strong>Acceptă crearea contului</strong></span>
            </button>
          </div>
          <div class="form-group-crearecont">
            <button
              class="btnn btn-primary btn-block"
              :disabled="loading"
              @click="deleteUser"
            >
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span><strong>Șterge contul</strong></span>
            </button>
          </div>
        </div>
        <div
          class="col-md-6-1"
          v-if="currentUser && currentUser.requests.length"
        >
          <h3>Cereri</h3>
          <div class="centrare">
            <table>
              <thead>
                <tr>
                  <th>Tip</th>
                  <th>Fișier</th>
                  <th>Acțiune</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(request, index) in currentUser.requests"
                  :key="index"
                >
                  <td>Candidat</td>
                  <td v-html="processLink(request.evidence)"></td>
                  <td>
                    <a
                      v-if="!request.status"
                      href="#"
                      @click="setRole(currentUser.id, request.id)"
                      >Acceptă</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="butoane">
          <div class="form-group-crearecont">
            <button
              class="btn btn-primary btn-block"
              :disabled="loading"
              @click="acceptAllUsers"
            >
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span><strong>Acceptă crearea tuturor conturilor</strong></span>
            </button>
          </div>
          <div class="form-group-crearecont">
            <button
              class="btn btn-primary btn-block"
              :disabled="loading"
              @click="deleteAllUsers"
            >
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span><strong>Șterge toate conturile inactive</strong></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";
import AdministratorService from "../services/administrator.service";
import axios from "axios";

export default {
  name: "GestionareConturi",
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
      name: "",
      loading: false,
    };
  },
  methods: {
    setRole(userId, requestId) {
      if (confirm("Acceptați ca votantul selectat să devină candidat?")) {
        axios
          .put(
            "http://" +
              window.location.hostname +
              ":8080/gestionareconturi/tip/" +
              userId,
            {
              requestId: requestId,
              accessToken: JSON.parse(window.localStorage.getItem("user"))
                .accessToken,
            }
          )
          .then(() => {
            this.refreshList();
          });
      }
    },
    processLink(file_name) {
      return (
        "<a href='http://" +
        window.location.hostname +
        ":8080/uploads/" +
        file_name +
        "' target='_blank'>" +
        file_name +
        "</a>"
      );
    },
    retrieveUsers() {
      AdministratorService.getAll()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveUsers();
      this.currentUser = null;
      this.currentIndex = -1;
    },

    acceptUser() {
      AdministratorService.activate(this.currentUser.id).then(() => {
        this.refreshList();
      });
    },

    deleteUser() {
      if (confirm("Sunteți sigur că doriți să ștergeți contul selectat?")) {
        AdministratorService.delete(this.currentUser.id).then(() => {
          this.refreshList();
        });
      }
    },

    acceptAllUsers() {
      AdministratorService.activateAll().then(() => {
        this.refreshList();
      });
    },

    deleteAllUsers() {
      if (
        confirm("Sunteți sigur că doriți să stergeti TOATE conturile inactive?")
      ) {
        AdministratorService.deleteAll().then(() => {
          this.refreshList();
        });
      }
    },

    isUserActive() {
      return this.currentUser.active;
    },

    setActiveUser(user, index) {
      this.currentUser = { ...user };
      this.currentIndex = index;
    },
    searchName() {
      AdministratorService.findAllByCondition(this.name)
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveUsers();
    UserService.getAdministratorBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  },
  //  computed: {
  //   currentUser() {
  //     return this.$store.state.auth.user;
  //   }
  // }
};
</script>
<style>
.list {
  text-align: left;

  margin: auto;
  margin-top: 3%;
  margin-bottom: 5%;
}

.col-md-6-1 {
  margin-top: 5%;
  margin-left: 5%;
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 5%;
  background-color: #b3cde0;
}

.list-group {
  border-radius: 25px;
  border: 2px solid #011f4b;
}
select {
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.btn-primary {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 20px;
  background-color: #011f4b;
  margin-top: 5%;
}
span {
  text-color: white;
}
.input-group {
  margin: 0%;
  border-radius: 25px;
  padding: 1%;
}
.butoane {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 3%;
  margin: auto;
  margin-left: 5%;
  margin-top: 10%;
  background-color: #b3cde0;
}
.btnn {
  padding: 1%;
  margin-top: 2%;
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
  margin-top: 5%;
  background-color: #b3cde0;
  box-shadow: 5px 5px 10px #011f4b;
}
.info {
  text-align: center;
  height: 50px;
  margin-top: 20px;
  text-shadow: 1px 1px;
}
table {
  border: 1px solid black;
  border-collapse: collapse;
}
th {
  border: 1px solid black;
  border-collapse: collapse;
}
td {
  border: 1px solid black;
  border-collapse: collapse;
}
.centrare {
  margin: auto;
}
</style>
