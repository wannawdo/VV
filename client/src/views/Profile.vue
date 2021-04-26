<template>
  <div class="container">
    <header class="jumbotron">
      <h3> Datele contului pentru:
        <br>
        <strong>{{currentUser.username}}</strong>
      </h3>
    </header>
   
    <p>
      <strong>Nume:</strong>
      {{currentUser.name}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Rol:</strong>
    <ul>
      <li v-for="(role,index) in currentUser.roles" :key="index">{{role}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>