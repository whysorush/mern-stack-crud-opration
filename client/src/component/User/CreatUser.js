import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./user.css";

const CreateUser = () => {
  const navigate = useNavigate();
  const createUserApi = "http://localhost:3000/items";
  const [error, setError] = useState(null);
  const [getUser, getUserList] = useState([]);
  const [user, setUser] = useState({
    name: "",
    description: "",
    _id: "",
  });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    await axios
      .get(createUserApi)
      .then((res) => {
        console.log(res.data);
        getUserList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInput = (event) => {
    console.log("editToggle", edit);
    console.log(user);
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = (event) => {
    console.log("editToggle", edit);
    console.log(user);
    if (edit) {
      event.preventDefault();
      console.log(user);
      axios
        .put(createUserApi + "/" + user._id, user)
        .then((response) => {
          console.log(response.data);
          setUser({ _id: "", name: "", description: "" });
          getUserData();

          setEdit(false);
          navigate("/");
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      event.preventDefault();
      console.log(user);
      axios
        .post(createUserApi, user)
        .then((response) => {
          console.log(response.data);
          setUser({ _id: "", name: "", description: "" });
          getUserData();

          navigate("/");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };
  const editHandler = (item) => {
    console.log("before", edit);
    setEdit(true);
    console.log(edit);
    console.log(item);
    setUser({ _id: item._id, name: item.name, description: item.description });
  };
  const deleteHandler = (item) => {
    console.log(item);
    axios
      .delete(createUserApi + "/" + item._id)
      .then((response) => {
        console.log(response.data);
        getUserData();
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <div className="container">
      <div className="row">
        <div className="user-form">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-header">
                <h3>Create User</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label for="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={user.name}
                      onChange={handleInput}
                    />
                  </div>
                  <div className="mb-3">
                    <label for="" className="form-label">
                      description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      value={user.description}
                      onChange={handleInput}
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">SrNo</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {getUser.map((item, i) => {
              return (
                <>
                  <tr key={i + 1}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        className="fa fa-pencil"
                        onClick={() => editHandler(getUser[i])}
                      >
                        edit
                      </button>
                      <button
                        className="fa fa-trash-o"
                        onClick={() => deleteHandler(getUser[i])}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateUser;
