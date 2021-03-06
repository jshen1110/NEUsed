import React, { Component } from "react";
import authContext from "../../auth-context";
import "./Form.css";
import withToast from "../../withToast.jsx";


class Form extends Component {
  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.contentElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.imageElRef = React.createRef();
    this.categoryElRef = React.createRef();
  }

  refreshPage() {
    setTimeout(() => window.location.replace("/discover/"), 1000);
  }

  static contextType = authContext;

  handleSubmit = e => {
    e.preventDefault();

    const title = this.titleElRef.current.value;
    const content = this.contentElRef.current.value;
    const price = this.priceElRef.current.value;
    const image = this.imageElRef.current.value;
    const category = this.categoryElRef.current.value;
    const email = this.context.email;
    const creator = this.context.givenName;

    if (this.validate({title, content, price, image})) {



    const requestBody = {
      query: `
        mutation {
          createPost(postInput:{title: "${title}", content: "${content}", price: ${price}, image:"${image}", category:${category}, email:"${email}", creator:"${creator}"}) {
            _id
            title
            content
            price
            image
            category
            email
            createdAt
            status
            creator
          }
        }
      `
    }

    const { showSuccess, showError } = this.props;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
        showError("Create Failed!")
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData);
      showSuccess("Successfully created new post!")
    })
    .catch((err) => {
      console.log(err);
    });

  }
  this.refreshPage();
  };

  validate (args) {
    const { showError } = this.props;
    // input validation
    if (
      args.title.trim().length === 0 ||
      args.price === null ||
      args.price < 0 ||
      args.content.trim().length === 0 ||
      args.image.trim().length === 0
    ) {
      showError("Bad input!");
      return false;
    }
    return true;
  }


  render() {

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Add Your Product</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="title">
              <label htmlFor="title">Name / Title</label>
              <input
                placeholder="Item Name"
                type="text"
                name="title"
                ref={this.titleElRef}
              />
            </div>
            <div className="price">
              <label htmlFor="price">Price</label>
              <input
                placeholder="$ 0.0"
                type="number"
                name="price"
                ref={this.priceElRef}

              />
            </div>
            <div className="content">
              <label htmlFor="content">Description</label>
              <textarea
                placeholder="Add Your Description"
                type="text"
                name="content"
                rows={3}
                ref={this.contentElRef}

              />
            </div>
            <div className="image">
            <label htmlFor="image">Image URL <a href="https://imgbb.com/">Get Image url here!</a></label>
              <input
                placeholder="Image URL"
                type="text"
                name="image"
                ref={this.imageElRef}

              />
            </div>
            <div className="category">
              <label htmlFor="category">Category</label>
              <select id="categories" name="categories" ref={this.categoryElRef}
>
                <option value="Apparel">Apparel</option>
                <option value="Electronics">Electronics</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Family">Family</option>
                <option value="FreeStuff">FreeStuff</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Other"  selected = "selected">Other</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>

            <div className="createPost">
              <button type="submit">Add Post Now</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withToast(Form);
