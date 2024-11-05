import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/students">Students</Link>
      <Link href="/classes">Classes</Link>
      <Link href="/courses">Courses</Link>
    </nav>
  );
}

export default Navbar;
