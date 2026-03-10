import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-[calc(100vh-4rem)]">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <TaskList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/categories"
                                element={
                                    <ProtectedRoute>
                                        <Categories />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tasks/new"
                                element={
                                    <ProtectedRoute>
                                        <CreateTask />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tasks/:id"
                                element={
                                    <ProtectedRoute>
                                        <TaskDetail />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tasks/:id/edit"
                                element={
                                    <ProtectedRoute>
                                        <EditTask />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
