<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Caută după nume"
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
    </div>
    <div class="col-md-6">
      <h4 class="u-list">Lista cu utilizatorii</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(user, index) in users"
          :key="index"
          @click="setActiveUser(user, index)"
        >
          {{ user.name }}
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
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";
import AdministratorService from "../services/administrator.service";

export default {
  name: "GestionareConturi",
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
      name: "",
    };
  },
  methods: {
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
  max-width: 750px;
  margin: auto;
  margin-top: 5%;
  margin-bottom: 10%;
}
.col-md-6 {
  margin-top: 5%;
}
.col-md-6-1 {
  margin-top: 5%;
  margin-left: 5%;
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 5%;
  background-color: #b3cde0;
}
.u-list {
  margin-bottom: 5%;
  text-align: center;
}
.list-group {
  border-radius: 25px;
  border: 2px solid #011f4b;
}
select {
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
