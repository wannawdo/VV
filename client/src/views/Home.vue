<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>

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
</script>
<style scoped>
.container{
  margin-top: 10%;
  border-radius: 15%;
  background-color: #011f4b;
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