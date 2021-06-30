<template>
  <div class="paginaCreareSesiuneVot">
    <div class="submit-form">
      <div v-if="!submitted">
        <div class="form-group">
          <label for="title">Nume</label>
          <input
            type="text"
            class="form-control"
            id="title"
            required
            v-model="sessions.name"
            name="title"
          />
        </div>

        <div class="form-group">
          <label for="duration">Durata</label>
          <input
            class="form-control"
            id="duration"
            required
            v-model="sessions.duration"
            name="duration"
          />
        </div>

        <button @click="saveTutorial" class="btn btn-success">Submit</button>
      </div>

      <div v-else>
        <h4>You submitted successfully!</h4>
        <button class="btn btn-success" @click="newTutorial">Add</button>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import VoteSessionsService from "../services/vote-sessions.service";

export default {
  name: "AddVoteSession",
  data() {
    return {
      tutorial: {
        id: null,
        title: "",
        duration: "",
        published: false,
      },
      submitted: false,
    };
  },
  methods: {
    saveTutorial() {
      var data = {
        name: this.sessions.name,
        duration: this.sessions.duration,
      };

      VoteSessionsService.create(data)
        .then((response) => {
          this.tutorial.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newTutorial() {
      this.submitted = false;
      this.tutorial = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>
