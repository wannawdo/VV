<template>
  <div class="container">
    
    <header class="jumbotron">
      <h3>{{content}}</h3>

      <h3 v-if="!loggedIn"> Fa-ti cont</h3>
      
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Home',
  data() {
    return {
      content: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    UserService.getPublicContent().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  }
};
document.body.style='background: #f4f4f4'
</script>
<style scoped>
.container{
  margin-top: 10%;
  border-radius: 15%;
  background-color: #141414;
  margin-bottom: 5%;
}
.jumbotron{
  background-color: #b3cde0;
  border-radius: 25%;
}
h3{
  text-align: center;
}
</style>