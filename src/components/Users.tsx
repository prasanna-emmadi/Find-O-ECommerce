import { List } from "@mui/material";
import { useGetUsersQuery } from "../redux/api/apiSlice";
import { Link } from "react-router-dom";
import { UserType } from "../types/userType";
import Suspense from "./Suspense";

interface Props {
    data: UserType[];
}
const InnerUserList = ({ data }: Props) => {
    return (
        <List data-testid="users">
            {data.map((user: UserType) => {
                const to = "/users/" + user.id;
                return (
                    <Link to={to} key={user.id}>
                        <div>{user.email} </div>
                    </Link>
                );
            })}
        </List>
    );
};

const UserList = () => {
    const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery();

    let content = (
        <Suspense
            data={data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
            Component={InnerUserList}
        />
    );

    return (
        <section className="users-list">
            <h2>users</h2>
            {content}
        </section>
    );
};
export default UserList;
