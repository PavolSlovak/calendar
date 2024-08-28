import { useAuth } from "../../store/authContext";
import Article from "../UI/Article";
import MainBanner from "../UI/MainBanner";

function Home() {
  const { logout } = useAuth();
  return (
    <main>
      <MainBanner>
        <article className="px-20">
          <h1 className="font-bold">Hello, Create Your Calendar!</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro,
            praesentium. Aperiam voluptate culpa voluptatibus porro. Harum
            pariatur, incidunt voluptas, qui autem fuga ad dolores odit
            similique ab rem repellat amet sint hic labore, maxime rerum ipsum
            expedita cupiditate itaque! Nulla, commodi voluptates? Totam quasi
            impedit sunt explicabo consequuntur! Voluptatibus ipsum, obcaecati
            delectus earum vero ut nihil maiores accusamus inventore amet.
          </p>
        </article>
        <button onClick={logout} className="btn-blue">
          Log Out
        </button>
      </MainBanner>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
      <Article>
        <h2>Features</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          commodi dolorum nulla eos perspiciatis suscipit rem ratione ea,
          incidunt tempora, sunt modi aspernatur facilis enim quos cum,
          obcaecati iste. Doloribus, nihil architecto deserunt rem omnis
          quisquam quia eius, temporibus ut sequi, libero pariatur quo magnam
          soluta. Suscipit laboriosam sunt voluptatem?
        </p>
      </Article>
    </main>
  );
}

export default Home;
