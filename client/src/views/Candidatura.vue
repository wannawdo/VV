<template>
  <div class="container">
    <header class="jumbotronn">
      <h3 class="info">
        Adaugă candidatura
      </h3>
    </header>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />

    <!-- Or manually control the data synchronization -->
    <!-- <quill-editor
      :content="content"
      :options="editorOption"
      @change="onEditorChange($event)"
    /> -->

    <div class="butonas">
      <button class="btnnn btn-primary btn-block">
        <span><strong>Trimite candidatură</strong></span>
      </button>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  name: "Candidatura",
  data() {
    return {
      content: "",
      editorOption: {},
    };
  },

  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    console.log("this is current quill instance object", this.editor);
    UserService.getCandidatBoard().then(
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
};
</script>
<style scoped>
button {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 20px;
  background-color: #011f4b;
}
.btnnn {
  width: 50%;
  margin: auto;
}
.butonas {
  align-content: center;
  margin: auto;
  margin-top: 5%;
}
.container {
  margin: auto;
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
  margin-bottom: 5%;
}
.info {
  text-align: center;
  text-shadow: 1px 1px;
}
</style>
