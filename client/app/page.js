import Image from "next/image";
import Link from "next/link";

const courses = 5;

export default function Home() {
  return (
    <div>
      <div>
        <div>
          <h1>App Actions</h1>
        </div>

        <ul className="flex flex-col">
          <Link href="/">
            <button>Create a course</button>
          </Link>
          <Link href="/">
            <button>Create a class</button>
          </Link>
          <Link href="/">
            <button>Add a student</button>
          </Link>
        </ul>
        <div className="flex flex-row justify-around mt-20 text-sm">
          <Link href="/students">Manage Students</Link>
          <Link href="/classes">Manage Classes</Link>
          <Link href="/courses">Manage Courses</Link>
        </div>

        <div>
          <h3>No Course Available</h3>
          <Link href="/create-course">
            <h4>Create a Course</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
