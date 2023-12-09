<script lang="ts">
    import Heading from "flowbite-svelte/Heading.svelte";
    import Timeline from "flowbite-svelte/Timeline.svelte";
    import TimelineItem from "flowbite-svelte/TimelineItem.svelte";
    import A from "flowbite-svelte/A.svelte";
    import Img from "flowbite-svelte/Img.svelte";
    import sampleTopicFile from '../../assets/sample-topic-file.md?raw'
    import sampleReadme from '../../assets/README.md?raw'

    import repoSelectImage from '../../assets/onboarding/repository.png'
    import permissionsSelectImage from '../../assets/onboarding/permissions.png'

    export let step = 0;

    const onExampleDownload = (content: string, filename: string) => {
        const blob = new Blob([content], {type: "text/markdown"});
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url,
            filename
        });
    }
</script>

<Heading class="mb-12">Let's set things up</Heading>
<Timeline>
    {#if step === 0}
            <TimelineItem title="Create a repository" >
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Create a <A href="https://github.com/new" target="_blank">new repository</A> on GitHub. This will be the source of your topics you want to share the world with.
                    <br/>
                    It can be private or public, it's up to you.
                </p>
            </TimelineItem>
            <TimelineItem title="Push some markdown to the repository" >
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Every talk or topic is a separate markdown file in your repository. You can have as many fields inside as you want.
                    <br/>
                    <br/>
                    Fields are key-value pairs, where the key is a level one heading and the value is everything below it until the next level one heading.
                    <br/>
                    It's nice to have a field called "Title" or "title", but it is not required. If you don't have it, the file name will be used in some UI parts.
                    <br/>
                    <br/>
                    To make things simpler, here is a <A on:click={() => onExampleDownload(sampleTopicFile, "sample-topic-file.md")}>sample topic file</A>.
                </p>
            </TimelineItem>
            <TimelineItem title="Tell a bit about yourself" >
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    When applying, you are always asked to provide some personal info, you never want to fill it out by hand.
                    <br/>
                    Personal info has the same format as topics, but it's a single file called "README.md" in the root of your repository.
                    <br/>
                    <br/>
                    Here's another <A on:click={() => onExampleDownload(sampleReadme, "README.md")}>example</A>.
                </p>
            </TimelineItem>
            <TimelineItem title="Create a personal access token" >
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Navigate to Github Developer <A href="https://github.com/settings/personal-access-tokens/new" target="_blank">settings</A> and create a personal access token.
                    <br/>
                    <br/>
                    It is recommended to use a fine-grained token that will only expose read access to one repository.
                    <br/>
                    <Img src={repoSelectImage} class="mt-2 mb-2" alt="An image demonstrating that you should only select a repository you just created for your access token" />
                    Select permissions for your token. You only need to grant "Contents" permissions ("Metadata" will be granted automatically with it)
                    <Img src={permissionsSelectImage} class="mt-2"  alt="Screenshot of Contents permissions on GitHub" />
                </p>
            </TimelineItem>
            <TimelineItem title="Save token and repo URL" >
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Look at the left of this page, there is a form where you can enter your token and repo URL.
                    <br/>
                    Click "Save" and then head over to the "Papers" tab.
                </p>
            </TimelineItem>
    {/if}

    {#if step === 1}
        <TimelineItem title="Sync your topics and personal info" >
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Click on the "Sync now!" button to pull your topics and personal info from GitHub.
            </p>
        </TimelineItem>
        <TimelineItem title="Start applying" >
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Once you can see the list here populated with your topics (and your personal info on the "Me" tab), you are ready to go!
                <br/>
                <br/>
                Go to any CFP page and click on the extension icon in the top right corner of your browser to open the sidebar.
            </p>
        </TimelineItem>
        <TimelineItem title="Your synced data only persists per-device" >
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                While API token and repo URL are syncronized across devices, your topics and personal info are not.
                <br/>
                When moving to a new device, you will just have to press the sync button again.
            </p>
        </TimelineItem>
    {/if}
</Timeline>