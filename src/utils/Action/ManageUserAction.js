//user common action
export const initialAction = {
  addShow: false,
  editShow: false,
  editShowId: null,
  viewShow: false,
  viewShowId: null,
  deleteShow: false,
  deleteId: null,
};

export function userActionReducer(state, action) {
  switch (action.type) {
    case "ADD/SHOW": {
      return {
        addShow: true,
        editShow: state?.editShow,
        deleteShow: state?.deleteShow,
        deleteId: null,
        editShowId: null,
      };
    }
    case "ADD/HIDE": {
      return {
        addShow: false,
        editShow: state?.editShow,
        deleteShow: state?.deleteShow,
        deleteId: null,
        editShowId: null,
      };
    }
    case "EDIT/SHOW": {
      return {
        addShow: state?.addShow,
        editShow: true,
        deleteShow: state?.deleteShow,
        deleteId: null,
        editShowId: action?.editFormatId,
      };
    }
    case "EDIT/HIDE": {
      return {
        addShow: state?.addShow,
        editShow: false,
        deleteShow: state?.deleteShow,
        deleteId: null,
        editShowId: null,
      };
    }
    case "VIEW/SHOW": {
      return {
        addShow: state?.addShow,
        editShow: state?.editShow,
        viewShow: true,
        deleteShow: state?.deleteShow,
        deleteId: null,
        viewShowId: action?.viewFormatId,
      };
    }
    case "VIEW/HIDE": {
      return {
        addShow: state?.addShow,
        editShow: state?.editShow,
        viewShow: false,
        deleteShow: state?.deleteShow,
        deleteId: null,
        viewShowId: null,
      };
    }
    case "ADD/EDIT/HIDE": {
      return {
        addShow: false,
        editShow: false,
        deleteShow: state?.deleteShow,
        deleteId: null,
        editShowId: null,
      };
    }
    case "DELETE/SHOW": {
      return {
        addShow: state?.addShow,
        editShow: state?.editShow,
        deleteShow: true,
        deleteId: action?.deleteFormatId,
        editShowId: null,
      };
    }
    case "DELETE/HIDE": {
      return {
        addShow: state?.addShow,
        editShow: state?.editShow,
        deleteShow: false,
        deleteId: null,
        editShowId: null,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

//user edit action
export const initialEditAction = {
  isEditMood: false,
  editId: null,
  isViewMood: false,
  viewId: null,
};

export function userEditActionReducer(state, action) {
  switch (action.type) {
    case "ISEDITMOOD/SHOW": {
      return {
        isEditMood: true,
        editId: action.editFormatId,
      };
    }
    case "ISEDITMOOD/HIDE": {
      return {
        isEditMood: false,
        editId: null,
      };
    }
    case "ISVIEWMOOD/SHOW": {
      return {
        isViewMood: true,
        viewId: action.viewFormatId,
      };
    }
    case "ISVIEWMOOD/HIDE": {
      return {
        isViewMood: false,
        viewId: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
