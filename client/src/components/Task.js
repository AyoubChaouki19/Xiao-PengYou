import "./Task.css";
export const Tasks = ({ task, id, state, deleteTask, crossTask }) => {
  console.log(state);
  return (
    <div className="task__container">
      <div className="task">
        <h3 style={{ textDecoration: state ? "line-through" : "none" }}>
          {task}
        </h3>
      </div>
      <div className="buttons">
        <button
          className="delete__btn"
          onClick={() => {
            deleteTask(id);
          }}
        >
          X
        </button>
        <button
          className="cross__btn"
          onClick={() => {
            crossTask(id);
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
