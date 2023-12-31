import React, { useState, useEffect } from "react";
import OperationTodo from "./EditTodo";
import { OpenPopUp } from "../components/Popup/popup";
import { notifyBackgroundPage } from "../message";
import { useDispatch, useSelector } from "react-redux";
import { updateSharedData } from "../redux/manager";
import { Provider } from "react-redux";
import store from "../redux/store";
export default function Todo({ todo }) {
  const [showDes, setSetShow] = useState(false);
  const [checkValidation, setcheckValidation] = useState(false);
  const handleshowDes = (e, id) => {
    setSetShow(!showDes);
    setTimeout(() => {
      document.getElementById(`taskdes${id}`).scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    });
  };

  var sharedData = useSelector((state) => state.sharedData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (checkValidation) {
      setcheckValidation(false);
      if (sharedData.name && sharedData.name.trim().length > 0) {
        console.log(sharedData, "submitted");
        notifyBackgroundPage("editTodo", sharedData);
      } else {
        console.log("task field is empty");
      }
    }
  }, [checkValidation]);

  const openEdit = () => {
    dispatch(updateSharedData({ ...todo }));
    OpenPopUp({
      elementID: "task-manager",
      textcomponent: {
        header: "Update Task Details",
        yes: "Edit",
        no: "Cancel",
      },
      PopupComponent: () => {
        return (
          <Provider store={store}>
            <OperationTodo action={"edit"} />
          </Provider>
        );
      },
      onYes: () => {
        setcheckValidation(true);
      },
    });
  };
  const openDelete = () => {
    OpenPopUp({
      elementID: "task-manager",
      textcomponent: {
        header: "Are You Sure You Want to Delete This Task?",
        yes: "Delete",
        no: "Cancel",
      },
      PopupComponent: () => {
        <></>;
      },
      onYes: (id) => {
        notifyBackgroundPage("deleteTodo", { id: todo.id });
      },
    });
  };
  const openNotify = () => {};

  return (
    <div className="task-wrapper">
      <div
        onClick={(e) => handleshowDes(e, todo.id)}
        className="task-preview-wrapper"
      >
        <div className="todo-wrapper">
          <div className="name">{todo.name}</div>
          <div className="duedate">
            <div>Duedate:</div>
            <div>{todo.duedate}</div>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="options">
          <div onClick={(e) => openEdit(todo)} className="edit">
            <img src={chrome.runtime.getURL("assests/images/edit.png")}></img>
          </div>
          <div onClick={openDelete} className="edit">
            <img src={chrome.runtime.getURL("assests/images/trash.png")}></img>
          </div>
          <div onClick={openNotify} className="edit">
            <img
              src={chrome.runtime.getURL("assests/images/notifyme.png")}
            ></img>
          </div>
        </div>
      </div>
      {showDes && (
        <div id={`taskdes${todo.id}`} className="description">
          {todo.description}
        </div>
      )}
    </div>
  );
}
