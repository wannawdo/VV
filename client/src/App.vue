<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark">
      <a href class="navbar-brand" @click.prevent>VV</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/acasa" class="nav-link">
            <font-awesome-icon icon="home" />Acasă
          </router-link>
        </li>
        <li v-if="showAdministratorBoard" class="nav-item">
          <router-link to="/gestionareconturi" class="nav-link"
            >Gestionare conturi</router-link
          >
        </li>
        <li v-if="showCandidatBoard" class="nav-item">
          <router-link to="/candidatura" class="nav-link"
            >Candidatura</router-link
          >
        </li>
        <li v-if="showAdministratorBoard" class="nav-item">
          <router-link v-if="currentUser" to="/sesiunivot" class="nav-link"
            >O nouă sesiune de vot</router-link
          >
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/candidati" class="nav-link"
            >Candidați</router-link
          >
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/vot" class="nav-link"
            >Votează</router-link
          >
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" />Înregistrează-te
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" />Intră în cont
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profil" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" />Ieșire
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
    <br />
    <br />

    <Footer />
  </div>
</template>

<script>
import Footer from "./views/Footer.vue";

export default {
  components: { Footer },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdministratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE = ADMINISTRATOR");
      }

      return false;
    },
    showCandidatBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE = CANDIDAT");
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
#app {
  background-color: #f4f4f4;
}
.navbar {
  background-color: #011f4b;
  margin-bottom: 2%;
  box-shadow: 5px 7px 5px #b3cde0;
}
svg {
  margin-right: 7px;
}
.nav-item {
  margin-right: 10px;
}
</style>
