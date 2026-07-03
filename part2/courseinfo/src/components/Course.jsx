const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

const Total = ({ total }) => {
  return <p>Number of exercises {total}</p>
}

const Course = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course
