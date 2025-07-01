import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Views from "../component/views";
import ToolBar from "../component/tool_bar";
import AddUser from "./add_user";
import EditUser from "./edit_user";
import axios from "../utils/axios";
import useDebounce from "../utils/useDebounce";
import { GENDER_MAP, JOB_MAP } from "../utils/convert";
import "../styles/App.css";

const USERS_PER_PAGE = 6;

const App = () => {
  const [viewMode, setViewMode] = useState("list");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.get("/users");
      // 將資料轉換成 Users 的格式
      const users = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        gender: GENDER_MAP[user.gender],
        job: JOB_MAP[user.job],
        birthday: user.birthday || "",
        phone: user.phone,
        imgSrc: user.imgSrc,
      }));
      setUsers(users);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // 搜尋過濾
  const filteredUsers = users.filter(
    (u) =>
      u.name.includes(debouncedSearch) ||
      u.gender.includes(debouncedSearch) ||
      u.job.includes(debouncedSearch) ||
      u.birthday.includes(debouncedSearch) ||
      u.phone.includes(debouncedSearch)
  );
  const totalPage = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const pagedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  // 事件
  const handleViewModeChange = (mode) => setViewMode(mode);
  const handleSearchChange = (val) => {
    setSearch(val);
    // setPage(1);
  };
  const handleAddUser = () => setShowAddUser(true);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPage, p + 1));

  // rerender user list
  const handleUserAdded = () => getAllUsers();

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const confirmClose = async (closeFn) => {
    const result = await Swal.fire({
      title: "Exit Editing?",
      text: "You have unsaved changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "Keep Editing",
    });

    if (result.isConfirmed) {
      closeFn();
    }
  };

  // 處理更新成功
  const handleUserEdited = () => {
    getAllUsers();
    setEditingUser(null);
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <ToolBar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchValue={search}
        onSearchChange={handleSearchChange}
        onAddUser={handleAddUser}
        page={page}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        totalPage={totalPage}
      />
      {isLoading ? (
        <div className="loader">載入中...</div>
      ) : error ? (
        <div className="error-message">
          載入失敗：{error.message}
          <button onClick={getAllUsers}>重試</button>
        </div>
      ) : (
        <Views users={pagedUsers} viewMode={viewMode} onEdit={handleEditUser} />
      )}
      {showAddUser && (
        <AddUser
          onClose={() => setShowAddUser(false)}
          onExit={() => confirmClose(() => setShowAddUser(false))}
          onUserAdded={handleUserAdded}
        />
      )}

      {editingUser && (
        <EditUser
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onExit={() => confirmClose(() => setEditingUser(null))}
          onUserEdited={handleUserEdited}
        />
      )}
    </div>
  );
};

export default App;
