<script>
    import { onMount } from "svelte";

    const Notification = window.Notification || window.mozNotification || window.webkitNotification;
    const granted = "granted";
    const denied = "denied";
    const promptThePermission = () => {
        Notification.requestPermission((permission) => {
            isGranted = permission === granted;
            console.log(permission);
            if ("permissions" in navigator) {
                navigator.permissions.query({ name: "notifications" }).then((notificationPerm) => {
                    notificationPerm.onchange = () => {
                        console.log(notificationPerm.state);
                        isGranted = notificationPerm.state === granted;
                        isDenied = Notification.permission === denied;
                    };
                });
            }
        });
    };
    let isGranted = false;
    let isDenied = false;
    onMount(() => {
        isGranted = Notification.permission === granted;
        isDenied = Notification.permission === denied;
    });
</script>

{#if !isGranted}
    <button class={isDenied ? "is-denied" : ""} on:click={() => promptThePermission()}> Notify on Updates? </button>
{/if}

<style lang="scss">
    button {
        position: fixed;
        left: 1rem;
        bottom: 1rem;
        cursor: pointer;
        background: white;
        color: black;
        z-index: 1337;
        border: none;

        &.is-denied {
            text-decoration: line-through;
        }
    }
</style>
