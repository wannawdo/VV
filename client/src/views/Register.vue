<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form @submit.prevent="handleRegister" enctype="multipart/form-data" name="form">
        <div v-if="!successful">
          <div class="form-group">
            <label for="name">Nume</label>
            <input
              v-model="user.name"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control"
              name="name"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="alert-danger"
            >{{errors.first('username')}}</div>
          </div>
          <div class="form-group">
            <label for="username">Nume de utilizator</label>
            <input
              v-model="user.username"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control"
              name="username"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="alert-danger"
            >{{errors.first('username')}}</div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="user.email"
              v-validate="'required|email|max:50'"
              type="email"
              class="form-control"
              name="email"
            />
            <div
              v-if="submitted && errors.has('email')"
              class="alert-danger"
            >{{errors.first('email')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Parolă</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control"
              name="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="alert-danger"
            >{{errors.first('password')}}</div>
          </div>
           <div class="cb">
              <label class="adauga-cerere">Doresc sa devin administrator: </label>
              <input class="checkbox" type="checkbox"/>
            </div>
          <div class="field">
        <label for="file" class="label"> Te rugăm să adaugi cererea aici:</label>
        <input
            type="file"
            ref="file"
            @change="selectFile"
        />
        </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block">Creează cont</button>
          </div>
        </div>
      </form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
import axios from 'axios';

export default {
  name: 'Register',
  
  data() {
    return {
      user: new User('','', '', ''),
      submitted: false,
      successful: false,
      message: '',
      file:''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profil');
    }
  },
  methods: {
    selectFile(){
            this.file=this.$refs.file.files[0];
        },
        // async sendFile(){
        //     const formData=new FormData();
        //     formData.append('file',this.file);
        //     try{
        //         await axios.post('/upload', formData);
        //     }
        //     catch(err){
        //         console.log(err);
        //     }
        // },
    handleRegister() {
      const formData=new FormData();
      formData.append('file',this.file);
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          
          this.$store.dispatch('auth/register', this.user).then(
            (data) => {
              this.message = data.message;
              axios.post('/register', formData);
              this.successful = true;
            },()=>{
            error => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
            }
          );
        }
      });
    }

  }
  
};
</script>

<style scoped>
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

.field{
  margin-bottom: 5%;
  display:block;
  width:100%
}
.card-container{
  background-color: #b3cde0;
}
input{
border-radius: 25px;
border: 2px solid #011f4b;
padding: 20px;
width: 100%;
}
button{
border-radius: 25px;
border: 2px solid #011f4b;
padding: 20px;
background-color: #011f4b;
}
img{
border-radius: 25px;
border: 2px solid #011f4b;
}
.cb{
display: flex;
justify-content: space-between;
}
.checkbox{
  margin-top:10%;
}
.card-container{
border-radius: 25px;
border: 2px solid #011f4b;
}
</style>