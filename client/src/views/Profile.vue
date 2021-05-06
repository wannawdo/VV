<template>
  <div class="pagina-profil">
    <header class="jumbotron">
      <h3 class="info">
        Informații despre cont
      </h3>
    </header>

    <div class="profile">
      <figure class="snip1336">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg"
          alt="sample87"
        />
        <figcaption>
          <!--<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg" alt="profile-sample4" class="profile" />-->
          <h2>
            {{ currentUser.name
            }}<span>Username: {{ currentUser.username }}</span>
          </h2>
          <p>E-mail: {{ currentUser.email }}</p>
          <a href="#" class="follow">Editează cont</a>
          <a href="#" class="info">Șterge cont</a>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      content: "",
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
    }
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
  min-width: 230px;
  max-width: 315px;
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
}
.cartonase {
  margin-top: 5%;
  text-align: center;
}

.jumbotron {
  border-radius: 25px;
  border: 2px solid #011f4b;
  margin-top: 5%;
  background-color: #b3cde0;
}
.info {
  text-align: center;
}
</style>
