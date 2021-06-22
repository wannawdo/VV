<template>
  <div class="poll-view">
    <div class="poll-view__title">
      Sesiune nouă de vot
    </div>
    <div class="poll-view__inner">
      <div class="poll-view__question">
        <input
          v-model="poll.description"
          type="text"
          placeholder="YourDescription..."
        />
      </div>
      <div class="poll-view__question">
        <input v-model="poll.duration" type="number" placeholder="Days" />
      </div>
      <div class="poll-view__question">
        <input
          v-model="poll.question"
          type="text"
          placeholder="Your Question..."
        />
      </div>
      <div class="poll-view__answers">
        <div
          v-for="(answer, index) in poll.answers"
          :key="index"
          class="answer"
          :style="{ zIndex: poll.answers.length - index }"
        >
          <input
            :placeholder="'Answer ' + (index + 1)"
            @focus="createNewInput(index)"
            v-model="poll.answers[index].answer"
            type="text"
          />
          <span class="delete" @click="deleteInput(index)">șterge opțiune</span>
        </div>
      </div>
      <div class="poll-view__submit">
        <button @click="createPoll">Creează sesiunea de vot</button>
      </div>
      <div
        class="poll-view__info"
        :class="{ success: success === true, error: success === false }"
        v-if="success !== null"
      >
        <div v-if="success === true">Created</div>
        <div v-if="success === false">Error</div>
      </div>
    </div>
    <div v-if="demo" class="poll-view__footer">
      Made with &hearts; by <a href="https://updivision.com/">updivision.com</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "./assets/vue-easy-polls.css";

export default {
  name: "poll-creator",
  props: {
    savePollUrl: {
      type: String,
    },
    demo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      poll: {
        question: "Pune aici întrebarea",
        duration: 20,
        description: "Completeaza descrierea",
        answers: [
          { answer: "Răspuns 1" },
          { answer: "Răspuns 2" },
          { answer: "Răspuns 3" },
          { answer: "" },
        ],
        multipleVotes: false,
      },
      isValid: false,
      success: null,
    };
  },
  mounted() {
    if (this.poll.answers.length == 0) {
      this.poll.answers.push({ answer: "" });
    }
  },
  methods: {
    createNewInput(index) {
      if (this.poll.answers.length - 1 == index) {
        this.poll.answers.push({ answer: "" });
      }
    },
    deleteInput(index) {
      if (index > 0 || this.poll.answers.length > 1) {
        this.poll.answers.splice(index, 1);
      }
    },
    createPoll() {
      this.validate();

      // demoelop only -----TO REMOVE--------------
      if (this.demo && this.isValid) {
        this.alert(true);
        setTimeout(() => {
          this.resetPoll();
        }, 1500);
        // --------------------------------
      } else if (this.demo && !this.isValid) {
        this.alert(false);
        setTimeout(() => {
          this.resetPoll();
        }, 1500);
      } else {
        if (this.isValid) {
          let data = JSON.parse(JSON.stringify(this.poll));
          let answers = [];
          for (let i = 0; i < data.answers.length; i++) {
            answers.push(data.answers[i].answer);
          }
          axios
            .post("http://" + window.location.hostname + ":8080/sesiunivot", {
              name: data.description,
              duration: data.duration,
              description: data.question,
              options: answers,
              accessToken: JSON.parse(window.localStorage.getItem("user"))
                .accessToken,
            })
            .then(() => {
              this.alert(true);
            });
        } else {
          this.alert(false);
        }
      }
    },
    resetPoll() {
      this.poll.multipleVotes = false;
      this.poll.answers = [];
      this.poll.answers.push({ answer: "" });
      this.poll.answers.push({ answer: "" });
      this.poll.answers.push({ answer: "" });
      this.poll.answers.push({ answer: "" });
      this.poll.question = "";
      this.isValid = false;
    },
    validate() {
      this.poll.answers = this.poll.answers.filter((answer) => {
        if (answer.answer.length > 0) {
          return answer;
        }
      });
      var count = this.poll.answers.length;
      if (count > 1) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    },
    alert(success) {
      this.success = success;
      setTimeout(() => {
        this.success = null;
      }, 3000);
    },
  },
};
</script>
