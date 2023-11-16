import React, { useEffect } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Divider, List, Skeleton } from "antd";
import { useUsers } from "../../contexts/UsersContext";
import { ErrorComponent } from "../../Components/ErrorComponent";

export function UsersList(){

    const {loadingUsers, users, getUserError, getUsers,} = useUsers()

    useEffect(() => {
        getUsers()
    }, [])

    const renderUsers = () => {
        return(
            <List 
                dataSource={users}

                renderItem={(u, ui) => {
                    
                    return(
                        <div className="hq-full-width">
                            <p className="default-gray">{ui+1}</p>
                        </div>
                    )
                }}
            />
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Users
            </Divider>

            <br/>

            {loadingUsers && <Skeleton />}

            {getUserError && !loadingUsers && 
                <ErrorComponent 
                    error={getUserError}
                    onReload={() => getUsers()}
                />
            }

            {!(loadingUsers || getUserError) && users && renderUsers()}
        </PagesWrapper>
    )
}