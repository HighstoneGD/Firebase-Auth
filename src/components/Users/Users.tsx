import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'
import useStyles from './style'
import { getUsersListSnapshot } from '../../auth/service'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CreateIcon from '@material-ui/icons/Create'
import { Layout } from '../../common'

const createData = (name: string | undefined, email: string | undefined, uid: string | null) => {
    return { name, email, uid }
}

const transformSnapshot = (snapshot: firebase.database.DataSnapshot): any[] => {
    if (snapshot.exists()) {
        const users = Object.keys(snapshot.val()).map(k => ({ ...snapshot.val()[k], uid: k }))
        return users.map(user => createData(user.name, user.email, user.uid))
    }
    return []
}

export const Users: React.FC = () => {
    const classes = useStyles()
    const [tableData, setTableData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [hoverElementEmail, setHoverElementEmail] = useState('')

    useEffect(() => {
        async function fetchUsers() {
          const data = transformSnapshot(await getUsersListSnapshot())
          return data
        }
        fetchUsers().then(users => {
            setTableData(users)
            setLoading(false)
        })
    }, []);

    const renderTable = () => 
        <TableContainer component={ Paper } className = { classes.table }>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { tableData.map((row) => (
                    <TableRow key={ row.email }>
                        <TableCell
                            onMouseOver = { () => {
                                setHoverElementEmail(row.email)
                            } }
                            onMouseLeave = { () => setHoverElementEmail('') }
                            style = { { position: 'relative' } }>
                            { row.name }
                            { hoverElementEmail === row.email ?
                                <CreateIcon 
                                    className = { classes.icon } 
                                    onClick = { () => { window.location.replace('/user/' + row.uid) } }/>
                                : null
                            }
                        </TableCell>
                        <TableCell >{ row.email }</TableCell>
                    </TableRow>
                )) }
                </TableBody>
            </Table>
        </TableContainer>

    return (
        <Layout>
            <div className = { classes.root }>
                <h1>Users</h1>
                { loading ? <CircularProgress /> : renderTable() }
            </div>
        </Layout>
    )
}