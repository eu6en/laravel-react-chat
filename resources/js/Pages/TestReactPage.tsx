import { Helmet } from "react-helmet";

export default function TestReactPage() {
    return (
        <section>
            <Helmet>
                <title>TestReactPage</title>
            </Helmet>
            <h2 className="test-class">Hello World from React</h2>
        </section>
    );
}
