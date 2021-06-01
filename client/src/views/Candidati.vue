<template>
  <div class="cartonase">
    <header class="jumbotronn">
      <h3 class="info">
        Candidați
      </h3>
    </header>
    <div class="cand">
      <figure class="snip1336" v-for="candidat in candidati" :key="candidat.id">
        <img :src="candidat.poza" alt="sample87" />
        <figcaption>
          <!--<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg" alt="profile-sample4" class="profile" />-->
          <h2>
            {{ candidat.nume }}<span>{{ candidat.prenume }}</span>
          </h2>
          <p>{{ candidat.descriere }}</p>
          <a href="#" class="follow">Follow</a>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: "Candidati",
  data() {
    return {
      content: "",
      candidati: [
        {
          id: 1,
          poza:
            "https://qph.fs.quoracdn.net/main-qimg-5004d88d80aa37fedeafaef8be2d8cf4",
          nume: "Ionel",
          prenume: "Popescu",
          descriere: "test tetsttt testt",
        },
        {
          id: 2,
          poza:
            "https://qph.fs.quoracdn.net/main-qimg-5004d88d80aa37fedeafaef8be2d8cf4",
          nume: "fdssfddl",
          prenume: "Podfsdfdscu",
          descriere: "test tetdfsddfddsft",
        },
        {
          id: 3,
          poza:
            "https://qph.fs.quoracdn.net/main-qimg-5004d88d80aa37fedeafaef8be2d8cf4",
          nume: "Gigel",
          prenume: "Popescu",
          descriere: "test tdsddsetsttt testt",
        },
        {
          id: 4,
          poza:
            "https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg",
          nume: "Ionel",
          prenume: "Popescu",
          descriere: "test tetsttt testt",
        },
        {
          id: 5,
          poza:
            "https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg",
          nume: "fdssfddl",
          prenume: "Podfsdfdscu",
          descriere: "test tetdfsddfddsft",
        },
        {
          id: 6,
          poza:
            "https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg",
          nume: "Gigel",
          prenume: "Popescu",
          descriere: "test tdsddsetsttt testt",
        },
      ],
    };
  },
  mounted() {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:300, 400, 600");
.snip1336 {
  font-family: "Roboto", Arial, sans-serif;
  position: relative;
  float: left;
  overflow: hidden;
  margin: 10px 1%;
  min-width: 230px;
  max-width: 315px;
  width: 100%;
  color: #ffffff;
  text-align: left;
  line-height: 1.4em;
  background-color: #141414;
  box-shadow: 5px 5px 10px #011f4b;
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
  margin-bottom: 10%;
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
  animation: zoominoutsinglefeatured 3s infinite;
  border-radius: 25px;
  border: 2px solid #011f4b;
  margin-top: 5%;
  background-color: #b3cde0;
  box-shadow: 5px 5px 10px #011f4b;
}

.info {
  text-align: center;
  text-shadow: 1px 1px;
}
.cand {
  margin-top: 5%;

  display: flex;
  flex-wrap: wrap;
  align-content: center;
}
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
}
</style>
