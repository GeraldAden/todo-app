import { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Stack, List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Todo } from './types/todo'
import { todoService } from './services/todoService'
import { format } from 'date-fns'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [description, setDescription] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orderByDeadline, setOrderByDeadline] = useState(false)

  const loadTodos = async () => {
    const data = await todoService.getAllTodos(statusFilter || undefined, orderByDeadline)
    setTodos(data)
  }

  useEffect(() => {
    loadTodos()
  }, [statusFilter, orderByDeadline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (description && deadlineDate) {
      await todoService.createTodo({
        description,
        deadline_date: deadlineDate
      })
      setDescription('')
      setDeadlineDate('')
      loadTodos()
    }
  }

  const handleStatusChange = async (todoId: number, newStatus: string) => {
    await todoService.updateTodoStatus(todoId, newStatus)
    loadTodos()
  }

  const handleDelete = async (todoId: number) => {
    await todoService.deleteTodo(todoId)
    loadTodos()
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo Application
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              sx={{ flexGrow: 1 }}
            />
            <TextField
              type="date"
              label="Deadline"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <Button type="submit" variant="contained">
              Add Todo
            </Button>
          </Stack>
        </form>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="started">Started</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => setOrderByDeadline(!orderByDeadline)}
          >
            {orderByDeadline ? 'Clear Sort' : 'Sort by Deadline'}
          </Button>
        </Stack>

        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={todo.description}
                secondary={`Deadline: ${format(new Date(todo.deadline_date), 'PP')}`}
              />
              <Stack direction="row" spacing={1}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={todo.status}
                    onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="started">Started</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  )
}

export default App
