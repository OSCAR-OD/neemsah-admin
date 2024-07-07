import { useAuth } from "../../Context/Auth/UseAuth";
import { getLocalStorage } from "../../utils/LocalStorage/ManageLocalStorage";
import AxiosInstance from "./AxiosInstance";

//const { token } = useAuth();
//console.log('Test',getLocalStorage("token"));

//Get response
export const getApiHandler = async (url, paramsData = {}) => {
  //console.log("getApiHandler - paramsData:", paramsData);
  try {
    const response = await AxiosInstance.get(
      url,
      {
        params: paramsData,
        headers: {
          // Authorization: "Bearer " + getLocalStorage("token"),
          // Authorization: token
          //   ? `Bearer ${token}`
          // : `Bearer ${getLocalStorage("token")}`,
          // Authorization: token
          //   ? "Bearer " + token
          //   : "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    //console.log("getApiHandler - response:", response);
    if (response?.data?.success) {
      return response?.data;
    }
  } catch (error) {
    //console.log("get error", error);

    return error;
  }
};

//Post response
export const postApiHandler = async (url, postData = {}, paramsData = {}) => {
  // const { token } = useAuth();
  try {
    const response = await AxiosInstance.post(
      url,
      postData,
      {
        params: paramsData,
        headers: {
          // Authorization: "Bearer " + getLocalStorage("token"),
           //Authorization: token
           //  ? "Bearer " + token
           //  : "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    // //console.log("postApiHandler - response:", response)

    if (response?.data?.success) {
      return response?.data;
    }
  } catch (error) {
    //console.log("post error", error);
    return error;
  }
};

//Delete response
export const deleteApiHandler = async (url) => {
  try {
    const response = await AxiosInstance.delete(
      url,

      {
        headers: {
          Authorization: "Bearer " + getLocalStorage("token"),
          // Authorization: token
          //   ? "Bearer " + token
          //   : "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response?.data?.success) {
      return response?.data;
    }
  } catch (error) {
    //console.log("delete error", error);

    return error;
  }
};

//Get data using useReducer

export const initialFetchData = {
  isError: false,
  errorMessage: null,
  isLoading: false,
  fetchData: [],
};

export function fetchReducer(state, action) {
  //console.log(action, "fetchReducer - state:", state?.isLoading);
  switch (action.type) {
    case "LOADING": {
      return {
        isLoading: true,
        fetchData: [],
        isError: null,
        errorMessage: null,
      };
    }
    case "LOADED": {
      return {
        isLoading: false,
        fetchData: action.dataFormat,
        isError: null,
        errorMessage: null,
      };
    }
    case "ERROR": {
      return {
        isLoading: false,
        fetchData: [],
        isError: true,
        errorMessage: action.errorFormat,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

/*

  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  
    const [{ addShow, editShow, deleteShow, deleteId }, dispatchUser] =
    useReducer(userActionReducer, initialAction);

      const [{ isEditMood, editId }, dispatchEditUser] = useReducer(
    userEditActionReducer,
    initialEditAction
  );

    dispatchUser({ type: "" });

    setShouldFetch((prev) => !prev);

      toast.success("Banner Deleted");

        if (res?.response?.status === 404) {
          toast.warn("Data not found");
        } else {
          toast.warn("Something went wrong");
        }

  //Condition Render
  let contentRender;

  if (isLoading) {
    contentRender = <TableSkeleton />;
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={6} />;
  } else if (fetchData?.length > 0) {
    contentRender = "hi";
  }

   // Delete Modal 
   <DeleteAlertModal
   isOpen={deleteShow}
   modifyText={"home banner"}
   handleAlertClose={handleHideDelete}
   handleAlertAction={handleDeleteAction}
 />

    const [shouldFetch, setShouldFetch] = useState(false);
  //Get all list
  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/banner/all");
    if (res?.success) {
      const dataFormat = res.data;
      dispatch({ type: "LOADED", dataFormat });
    } else {
      if (res?.response?.status === 404) {
        const errorFormat = "Data not found";
        dispatch({ type: "ERROR", errorFormat });
      } else {
        const errorFormat = "Something went wrong";
        dispatch({ type: "ERROR", errorFormat });
      }
    }
 
  };

  useEffect(() => {
    getFetchList();
  }, [shouldFetch]);


    //Hide Delete  functionality
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/banner/delete/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Banner Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //?Upload Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    dispatchUser({ type: "ADD/SHOW" });
    dispatchEditUser({ type: "ISEDITMOOD/HIDE" });
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    dispatchUser({ type: "ADD/HIDE" });
    dispatchEditUser({ type: "ISEDITMOOD/HIDE" });
  };

   //?Banner modal
  const handleShowDelete = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };

*/
