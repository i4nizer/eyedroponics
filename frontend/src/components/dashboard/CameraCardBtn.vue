<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                text="Pests Prediction"
                elevation="1"
                prepend-icon="mdi-bug-check"
                class="mr-2 bg-orange"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card prepend-icon="mdi-bug-check" title="Pests Prediction" class="text-orange">
                <v-table class="mx-5 my-5 border">
                    <thead>
                        <tr>
                            <th>Pest</th>
                            <th>Detected</th>
                            <th>Expected</th>
                            <th>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Honey Bees</td>
                            <td>300</td>
                            <td>280</td>
                            <td>90%</td>
                        </tr>
                        <tr>
                            <td>White Fly</td>
                            <td>300</td>
                            <td>80</td>
                            <td>90%</td>
                        </tr>
                        <tr>
                            <td>Bugs</td>
                            <td>300</td>
                            <td>450</td>
                            <td>90%</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>

</script>