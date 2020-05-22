import React from "react"

const InitialState = ({ state }: { state: any }) => (
    <script dangerouslySetInnerHTML={{
        __html: `window.initialState = ${JSON.stringify(state)};`
    }}>
    </script>
)

export default InitialState;
